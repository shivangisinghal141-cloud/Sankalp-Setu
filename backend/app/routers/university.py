from __future__ import annotations

import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, status

from app.db import db_session
from app.schemas import ProjectProgressRequest, UniversityProposalRequest
from app.services.events import add_notification, emit_event


router = APIRouter(prefix="/api/v1/university", tags=["University & IIC Collaboration"])


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _project_row_to_dict(row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "titleHi": row["title_hi"] or row["title"],
        "category": row["category"],
        "university": row["university"],
        "problemRef": row["problem_ref"],
        "location": row["location"],
        "progress": row["progress"],
        "status": row["status"],
        "leadStudent": row["lead_student"],
        "mentor": row["mentor"],
        "fundingStatus": row["funding_status"],
        "description": row["description"],
    }


def _challenge_row_to_dict(row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "category": row["category"],
        "location": row["location"],
        "priority": row["priority"],
        "reportsCount": row["reports_count"],
        "reports": row["reports_label"],
        "description": row["description"],
        "linkedIssueId": row["linked_issue_id"],
        "status": row["status"],
    }


def _next_project_id(conn) -> str:
    rows = conn.execute("SELECT id FROM university_projects WHERE id LIKE 'UNIV-PRJ-%'").fetchall()
    max_seq = 103
    for r in rows:
        m = re.search(r"UNIV-PRJ-(\d+)$", r["id"])
        if m:
            max_seq = max(max_seq, int(m.group(1)))
    return f"UNIV-PRJ-{max_seq + 1}"


@router.get("/challenges")
def list_challenges() -> List[Dict[str, Any]]:
    with db_session() as conn:
        rows = conn.execute("SELECT * FROM university_challenges ORDER BY created_at DESC").fetchall()
        return [_challenge_row_to_dict(r) for r in rows]


@router.get("/projects")
def list_projects() -> List[Dict[str, Any]]:
    with db_session() as conn:
        rows = conn.execute("SELECT * FROM university_projects ORDER BY created_at DESC").fetchall()
        return [_project_row_to_dict(r) for r in rows]


@router.post("/proposals", status_code=status.HTTP_201_CREATED)
def submit_proposal(payload: UniversityProposalRequest) -> Dict[str, Any]:
    """Create an IIC R&D solution proposal for a societal challenge."""
    now_iso = _now_iso()
    with db_session() as conn:
        chal = conn.execute(
            "SELECT * FROM university_challenges WHERE id = ?", (payload.challengeId,)
        ).fetchone()
        category = payload.category or (chal["category"] if chal else "नागरिक नवाचार")
        location = payload.location or (chal["location"] if chal else "जयपुर")
        problem_ref = payload.problemRef or (chal["linked_issue_id"] if chal else payload.challengeId)

        prj_id = _next_project_id(conn)
        conn.execute(
            """
            INSERT INTO university_projects (
                id, title, title_hi, category, university, problem_ref, location,
                progress, status, lead_student, mentor, funding_status, description,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                prj_id,
                payload.projectTitle,
                payload.projectTitle,
                category,
                payload.university,
                problem_ref,
                location,
                15,
                "प्रस्ताव स्वीकृत (IIC R&D)",
                payload.studentTeam,
                payload.mentor,
                "प्रस्तावित ₹2.0 लाख",
                payload.methodology or "60-दिवसीय प्रोटोटाइप एवं फील्ड पायलट कार्ययोजना।",
                now_iso,
                now_iso,
            ),
        )

        # Record collaboration milestone if linked to an issue
        conn.execute(
            """
            INSERT INTO collaboration_milestones (
                id, issue_id, phase, owner_type, owner_name, summary, completed, created_at
            ) VALUES (?, ?, 'Prototyping', 'university', ?, ?, 0, ?)
            """,
            (
                f"MIL-{uuid.uuid4().hex[:8].upper()}",
                problem_ref,
                payload.university,
                f"IIC Proposal '{payload.projectTitle}' submitted by {payload.studentTeam}",
                now_iso,
            ),
        )

        emit_event(
            conn,
            topic="sankalp.university.proposals",
            event_type="university.proposal_submitted",
            entity_id=prj_id,
            payload={"challengeId": payload.challengeId, "university": payload.university, "problemRef": problem_ref},
        )
        add_notification(
            conn,
            f"🎓 {payload.university} ने '{payload.projectTitle}' नवाचार प्रस्ताव प्रस्तुत किया",
            notif_type="university",
            issue_id=problem_ref,
        )

        row = conn.execute("SELECT * FROM university_projects WHERE id = ?", (prj_id,)).fetchone()
        return _project_row_to_dict(row)


@router.patch("/projects/{project_id}/progress")
def update_project_progress(project_id: str, payload: ProjectProgressRequest) -> Dict[str, Any]:
    now_iso = _now_iso()
    with db_session() as conn:
        row = conn.execute("SELECT * FROM university_projects WHERE id = ?", (project_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"University project '{project_id}' not found")

        new_status = payload.status or (
            "सफलतापूर्वक स्थापित" if payload.progress >= 90 else "प्रोटोटाइप परीक्षण" if payload.progress >= 45 else "अनुसंधान एवं विकास"
        )
        conn.execute(
            "UPDATE university_projects SET progress = ?, status = ?, updated_at = ? WHERE id = ?",
            (payload.progress, new_status, now_iso, project_id),
        )
        emit_event(
            conn,
            topic="sankalp.university.progress",
            event_type="university.progress_updated",
            entity_id=project_id,
            payload={"progress": payload.progress, "status": new_status, "note": payload.milestoneNote},
        )
        updated = conn.execute("SELECT * FROM university_projects WHERE id = ?", (project_id,)).fetchone()
        return _project_row_to_dict(updated)
