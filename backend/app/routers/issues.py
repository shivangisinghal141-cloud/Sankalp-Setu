from __future__ import annotations

import base64
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.config import settings
from app.db import db_session, issue_row_to_dict
from app.schemas import (
    AiReasoningResponse,
    EvidenceUploadRequest,
    IssueActionRequest,
    IssueCreateRequest,
    IssueResponse,
    IssueValidateRequest,
    IvrIntakeRequest,
)
from app.services.ai_engine import CATEGORY_DEFS, find_duplicate_issue, run_nlp_pipeline
from app.services.events import add_notification, dispatch_priority_alerts, emit_event
from app.services.privacy import hash_phone, mask_phone
from app.services.routing_engine import build_reasoning_factors, match_stakeholders_and_reason


router = APIRouter(tags=["Issues & Multi-Modal Intake"])

STAGE_MAP = {
    "registered": ("दर्ज", 0),
    "verified": ("सत्यापित", 2),
    "routed": ("सत्यापित", 3),
    "in_progress": ("प्रगति पर", 4),
    "resolved": ("समाधान", 5),
    "impact_verified": ("समाधान", 5),
}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _next_issue_id(conn) -> str:
    rows = conn.execute("SELECT id FROM issues WHERE id LIKE 'SNK-2026-%'").fetchall()
    max_seq = 21
    for r in rows:
        m = re.search(r"SNK-2026-(\d+)$", r["id"])
        if m:
            max_seq = max(max_seq, int(m.group(1)))
    return f"SNK-2026-{max_seq + 1:04d}"


def _build_initial_timeline(date_str: str, time_str: str, confidence: int, auto_validated: bool, dept_name: str) -> List[Dict[str, Any]]:
    ts = f"{date_str} {time_str}"
    return [
        {"step": "दर्ज", "date": ts, "completed": True, "desc": "नागरिक द्वारा समस्या दर्ज की गई"},
        {"step": "AI विश्लेषण", "date": ts, "completed": True, "desc": f"AI प्रारंभिक मूल्यांकन ({confidence}% सटीकता)"},
        {
            "step": "सत्यापन",
            "date": ts if auto_validated else "लंबित",
            "completed": auto_validated,
            "current": not auto_validated,
            "desc": "AI स्वचालित पूर्व-सत्यापन पूर्ण" if auto_validated else "विभागीय सत्यापन लंबित",
        },
        {
            "step": "सही संस्था",
            "date": ts if auto_validated else "लंबित",
            "completed": auto_validated,
            "current": auto_validated,
            "desc": f"{dept_name} एवं भागीदारों को स्मार्ट रूट किया गया",
        },
        {"step": "समाधान", "date": "लंबित", "completed": False, "desc": "समाधान कार्य लंबित"},
        {"step": "प्रभाव", "date": "लंबित", "completed": False, "desc": "प्रभाव मूल्यांकन लंबित"},
    ]


def _ingest_issue_pipeline(payload: IssueCreateRequest) -> Dict[str, Any]:
    now_dt = datetime.now()
    date_str = now_dt.strftime("%Y-%m-%d")
    time_str = now_dt.strftime("%I:%M %p")
    now_iso = _now_iso()

    raw_dict = payload.model_dump()
    nlp = run_nlp_pipeline(raw_dict)

    masked_phone = mask_phone(payload.citizenPhone)
    phone_digest = hash_phone(payload.citizenPhone)

    with db_session() as conn:
        existing_rows = conn.execute(
            "SELECT id, title, description, category_key, lat, lng, duplicate_of, duplicate_count FROM issues"
        ).fetchall()
        existing_list = [dict(r) for r in existing_rows]

        dup_match = find_duplicate_issue(
            candidate_title=payload.title,
            candidate_desc=payload.description,
            category_key=nlp.category_key,
            lat=nlp.lat,
            lng=nlp.lng,
            existing_issues=existing_list,
        )

        issue_id = _next_issue_id(conn)
        duplicate_of = dup_match[0] if dup_match else None
        dup_similarity = dup_match[1] if dup_match else None
        effective_dup_count = 1

        if duplicate_of:
            conn.execute(
                "UPDATE issues SET duplicate_count = duplicate_count + 1, updated_at = ? WHERE id = ?",
                (now_iso, duplicate_of),
            )
            parent_row = conn.execute(
                "SELECT duplicate_count FROM issues WHERE id = ?", (duplicate_of,)
            ).fetchone()
            if parent_row:
                effective_dup_count = int(parent_row["duplicate_count"])

        matched_stakeholders, reasoning, routing_tier = match_stakeholders_and_reason(
            conn=conn,
            category_key=nlp.category_key,
            category_hi=nlp.category_hi,
            location=payload.location,
            lat=nlp.lat,
            lng=nlp.lng,
            priority_key=nlp.priority_key,
            ai_confidence=nlp.ai_confidence,
            duplicate_count=effective_dup_count,
        )

        auto_validated = nlp.ai_confidence >= 90 and not duplicate_of
        status_hi = "सत्यापित" if auto_validated else "दर्ज"
        status_key = "verified" if auto_validated else "registered"

        timeline = _build_initial_timeline(
            date_str=date_str,
            time_str=time_str,
            confidence=nlp.ai_confidence,
            auto_validated=auto_validated,
            dept_name=matched_stakeholders["government"]["name"],
        )

        questionnaire = {
            "affectedPeople": payload.affectedPeople,
            "immediateDanger": payload.immediateDanger,
            "damageDescription": payload.damageDescription,
            "duration": payload.duration,
            "impactLevel": payload.impactLevel,
            "evidenceChoice": payload.evidenceChoice,
            "voiceAnswer": payload.voiceAnswer,
        }
        evidence = {
            "photoEvidence": payload.photoEvidence.model_dump() if payload.photoEvidence else None,
            "videoEvidence": payload.videoEvidence.model_dump() if payload.videoEvidence else None,
        }
        nlp_insights = {
            "detectedLanguage": nlp.detected_language,
            "entities": nlp.entities,
            "severityScore": nlp.severity_score,
            "routingTier": routing_tier,
            "duplicateSimilarity": dup_similarity,
        }

        conn.execute(
            """
            INSERT INTO issues (
                id, title, title_en, category, category_key, location, location_en,
                lat, lng, date, status, status_key, priority, priority_key,
                severity_score, routing_tier, citizen_name, citizen_phone, citizen_phone_hash,
                dpdp_consent, intake_channel, language, description, ai_confidence,
                duplicate_count, duplicate_of, assigned_dept, dept_id,
                matched_stakeholders_json, ai_routing_reasoning_json, timeline_json,
                questionnaire_json, evidence_json, nlp_insights_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                issue_id,
                payload.title,
                payload.title,
                nlp.category_hi,
                nlp.category_key,
                payload.location,
                payload.location,
                nlp.lat,
                nlp.lng,
                date_str,
                status_hi,
                status_key,
                nlp.priority_hi,
                nlp.priority_key,
                nlp.severity_score,
                routing_tier,
                payload.citizenName or "नागरिक",
                masked_phone,
                phone_digest,
                1 if payload.dpdpConsent else 0,
                payload.intakeChannel,
                nlp.detected_language,
                payload.description,
                nlp.ai_confidence,
                1,
                duplicate_of,
                nlp.assigned_dept,
                nlp.dept_id,
                json.dumps(matched_stakeholders, ensure_ascii=False),
                json.dumps(reasoning, ensure_ascii=False),
                json.dumps(timeline, ensure_ascii=False),
                json.dumps(questionnaire, ensure_ascii=False),
                json.dumps(evidence, ensure_ascii=False),
                json.dumps(nlp_insights, ensure_ascii=False),
                now_iso,
                now_iso,
            ),
        )

        # Emit Kafka-compatible lifecycle events
        emit_event(
            conn,
            topic="sankalp.complaints.ingested",
            event_type="complaint.submitted",
            entity_id=issue_id,
            payload={"channel": payload.intakeChannel, "language": nlp.detected_language},
        )
        emit_event(
            conn,
            topic="sankalp.ai.pipeline",
            event_type="ai.classified_and_scored",
            entity_id=issue_id,
            payload={
                "categoryKey": nlp.category_key,
                "priorityKey": nlp.priority_key,
                "severityScore": nlp.severity_score,
                "aiConfidence": nlp.ai_confidence,
                "duplicateOf": duplicate_of,
            },
        )
        if duplicate_of:
            add_notification(
                conn,
                f"🔁 डुप्लीकेट पहचान: {issue_id} को {duplicate_of} से लिंक किया गया (Similarity {int((dup_similarity or 0) * 100)}%)",
                notif_type="ai",
                issue_id=issue_id,
            )
        else:
            add_notification(
                conn,
                f"नई {nlp.category_hi} शिकायत {issue_id} दर्ज हुई ({nlp.ai_confidence}% AI विश्वास)",
                notif_type="new",
                issue_id=issue_id,
            )

        dispatch_priority_alerts(
            conn=conn,
            issue_id=issue_id,
            routing_tier=routing_tier,
            priority_key=nlp.priority_key,
            matched_stakeholders=matched_stakeholders,
        )

        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        return issue_row_to_dict(row)


@router.post("/api/v1/complaints/webhook", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def complaints_webhook(payload: IssueCreateRequest) -> Dict[str, Any]:
    """Live complaint webhook advertised by LandingPage.jsx (/api/v1/complaints/webhook)."""
    webhook_payload = payload.model_copy(update={"intakeChannel": "webhook"})
    return _ingest_issue_pipeline(webhook_payload)


@router.post("/api/v1/issues", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def create_issue(payload: IssueCreateRequest) -> Dict[str, Any]:
    """Create a new citizen challenge/complaint and run the 6-stage AI & routing pipeline."""
    return _ingest_issue_pipeline(payload)


@router.post("/api/v1/issues/ivr", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def create_ivr_or_csc_issue(payload: IvrIntakeRequest) -> Dict[str, Any]:
    """Toll-free IVR (1800-185-2026) and CSC/Panchayat facilitator intake endpoint."""
    issue_req = IssueCreateRequest(
        title=payload.transcript[:80],
        description=payload.transcript,
        location=f"{payload.wardOrPanchayat}, {payload.district}",
        citizenName=f"IVR/CSC नागरिक ({payload.facilitatorId or '1800-185-2026'})",
        citizenPhone=payload.callerPhone,
        language=payload.language,
        intakeChannel=payload.channel,
        dpdpConsent=True,
    )
    return _ingest_issue_pipeline(issue_req)


@router.post("/api/v1/issues/evidence", status_code=status.HTTP_201_CREATED)
def upload_evidence(payload: EvidenceUploadRequest) -> Dict[str, Any]:
    """Save base64-encoded photo/video evidence safely in local upload storage."""
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", Path(payload.filename).name) or "evidence.bin"
    stored_name = f"{uuid.uuid4().hex[:12]}_{safe_name}"
    target_path = settings.upload_dir / stored_name

    raw_b64 = payload.dataBase64.split(",", 1)[-1]
    try:
        binary = base64.b64decode(raw_b64, validate=True)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid base64 evidence payload: {exc}") from exc

    target_path.write_bytes(binary)
    return {
        "name": safe_name,
        "storedName": stored_name,
        "type": payload.contentType,
        "sizeBytes": len(binary),
        "url": f"/uploads/{stored_name}",
    }


@router.get("/api/v1/issues", response_model=List[IssueResponse])
def list_issues(
    status_key: Optional[str] = Query(default=None),
    priority_key: Optional[str] = Query(default=None),
    category_key: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> List[Dict[str, Any]]:
    query = "SELECT * FROM issues WHERE 1=1"
    params: List[Any] = []

    if status_key and status_key != "all":
        if status_key == "in_progress":
            query += " AND status_key IN ('in_progress', 'verified')"
        elif status_key == "pending":
            query += " AND status_key IN ('registered', 'filed', 'pending')"
        else:
            query += " AND status_key = ?"
            params.append(status_key)

    if priority_key:
        query += " AND priority_key = ?"
        params.append(priority_key)

    if category_key:
        query += " AND category_key = ?"
        params.append(category_key)

    if search:
        pattern = f"%{search.strip()}%"
        query += " AND (id LIKE ? OR title LIKE ? OR location LIKE ? OR description LIKE ?)"
        params.extend([pattern, pattern, pattern, pattern])

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    with db_session() as conn:
        rows = conn.execute(query, tuple(params)).fetchall()
        return [issue_row_to_dict(r) for r in rows]


@router.get("/api/v1/issues/track/{query}", response_model=IssueResponse)
def track_issue(query: str) -> Dict[str, Any]:
    """Track complaint live by ID (e.g. SNK-2026-0012) or keyword/location."""
    q = query.strip()
    with db_session() as conn:
        row = conn.execute("SELECT * FROM issues WHERE LOWER(id) = LOWER(?)", (q,)).fetchone()
        if not row:
            like_q = f"%{q}%"
            row = conn.execute(
                """
                SELECT * FROM issues
                WHERE title LIKE ? OR location LIKE ? OR description LIKE ?
                ORDER BY created_at DESC LIMIT 1
                """,
                (like_q, like_q, like_q),
            ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Issue '{q}' not found")
        return issue_row_to_dict(row)


@router.get("/api/v1/issues/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: str) -> Dict[str, Any]:
    with db_session() as conn:
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Issue '{issue_id}' not found")
        return issue_row_to_dict(row)


@router.get("/api/v1/issues/{issue_id}/reasoning", response_model=AiReasoningResponse)
def get_issue_reasoning(issue_id: str) -> Dict[str, Any]:
    """Return 5-factor AI routing explainability for AiReasoningModal.jsx."""
    with db_session() as conn:
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Issue '{issue_id}' not found")
        issue = issue_row_to_dict(row)
        return {
            "issueId": issue["id"],
            "title": issue["title"],
            "assignedDept": issue["assignedDept"],
            "aiConfidence": issue["aiConfidence"],
            "routingTier": issue["routingTier"],
            "matchedStakeholders": issue["matchedStakeholders"],
            "factors": build_reasoning_factors(issue),
            "rawReasoning": issue["aiRoutingReasoning"],
        }


@router.post("/api/v1/issues/{issue_id}/validate", response_model=IssueResponse)
def validate_issue(issue_id: str, payload: IssueValidateRequest) -> Dict[str, Any]:
    """Human-in-the-loop officer validation & priority override (Slide 3 Step 5)."""
    now_iso = _now_iso()
    ts = datetime.now().strftime("%Y-%m-%d %I:%M %p")

    with db_session() as conn:
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Issue '{issue_id}' not found")

        timeline = json.loads(row["timeline_json"])
        priority_key = payload.overridePriority or row["priority_key"]
        priority_map = {"high": "उच्च", "medium": "मध्यम", "low": "निम्न"}
        priority_hi = priority_map.get(priority_key, row["priority"])

        if payload.approved:
            status_hi, status_key = "सत्यापित", "verified"
            for idx in (0, 1, 2, 3):
                if idx < len(timeline):
                    timeline[idx]["completed"] = True
                    timeline[idx]["current"] = False
                    if timeline[idx].get("date") in {"लंबित", ""}:
                        timeline[idx]["date"] = ts
            if len(timeline) > 2:
                timeline[2]["desc"] = f"अधिकारी {payload.officerId} द्वारा सत्यापित: {payload.notes or 'स्वीकृत'}"
            if len(timeline) > 4:
                timeline[4]["current"] = True
        else:
            status_hi, status_key = "अस्वीकृत / स्पैम", "rejected"

        conn.execute(
            """
            UPDATE issues
            SET status = ?, status_key = ?, priority = ?, priority_key = ?,
                timeline_json = ?, updated_at = ?
            WHERE id = ?
            """,
            (status_hi, status_key, priority_hi, priority_key, json.dumps(timeline, ensure_ascii=False), now_iso, issue_id),
        )
        emit_event(
            conn,
            topic="sankalp.validation",
            event_type="issue.validated" if payload.approved else "issue.rejected",
            entity_id=issue_id,
            payload={"officerId": payload.officerId, "approved": payload.approved, "priorityKey": priority_key},
        )
        add_notification(
            conn,
            f"अधिकारी {payload.officerId} ने {issue_id} को '{status_hi}' चिन्हित किया",
            notif_type="gov",
            issue_id=issue_id,
        )
        updated = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        return issue_row_to_dict(updated)


@router.post("/api/v1/issues/{issue_id}/action", response_model=IssueResponse)
def advance_issue_action(issue_id: str, payload: IssueActionRequest) -> Dict[str, Any]:
    """Government nodal action: advance issue through the 6-stage lifecycle."""
    now_iso = _now_iso()
    ts = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    status_hi, stage_idx = STAGE_MAP[payload.stage]

    with db_session() as conn:
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Issue '{issue_id}' not found")

        timeline = json.loads(row["timeline_json"])
        for i, step in enumerate(timeline):
            if i <= stage_idx and payload.stage in {"resolved", "impact_verified"}:
                step["completed"] = True
                step["current"] = False
                if step.get("date") in {"लंबित", "", "प्रगति पर", "प्रक्रियाधीन"}:
                    step["date"] = ts
            elif i < stage_idx:
                step["completed"] = True
                step["current"] = False
                if step.get("date") in {"लंबित", ""}:
                    step["date"] = ts
            elif i == stage_idx:
                step["completed"] = payload.stage == "impact_verified"
                step["current"] = payload.stage != "impact_verified"
                step["date"] = ts if step["completed"] else "प्रगति पर"
                step["desc"] = payload.remarks

        new_status_key = "resolved" if payload.stage in {"resolved", "impact_verified"} else payload.stage
        assigned_dept = payload.department or row["assigned_dept"]

        conn.execute(
            """
            UPDATE issues
            SET status = ?, status_key = ?, assigned_dept = ?, timeline_json = ?, updated_at = ?
            WHERE id = ?
            """,
            (status_hi, new_status_key, assigned_dept, json.dumps(timeline, ensure_ascii=False), now_iso, issue_id),
        )
        emit_event(
            conn,
            topic="sankalp.lifecycle",
            event_type="issue.stage_updated",
            entity_id=issue_id,
            payload={"stage": payload.stage, "officerId": payload.officerId, "remarks": payload.remarks},
        )
        add_notification(
            conn,
            f"विभाग द्वारा शिकायत {issue_id} पर कार्रवाई ('{status_hi}') स्वीकृत की गई",
            notif_type="gov",
            issue_id=issue_id,
        )
        updated = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        return issue_row_to_dict(updated)
