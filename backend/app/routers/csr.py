from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, status

from app.db import db_session, format_inr
from app.schemas import CsrPledgeRequest, PartnerVerificationRequest
from app.services.events import add_notification, emit_event


router = APIRouter(prefix="/api/v1/csr", tags=["Industry & CSR Partnerships"])

CIN_REGEX = re.compile(r"^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$")
GSTIN_REGEX = re.compile(r"^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$")
CSR1_REGEX = re.compile(r"^CSR\d{8}$")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _opp_row_to_dict(row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "titleEn": row["title_en"],
        "category": row["category"],
        "targetResource": row["target_resource"],
        "targetAmountInr": row["target_amount_inr"],
        "raisedResource": row["raised_resource"],
        "raisedAmountInr": row["raised_amount_inr"],
        "status": row["status"],
        "statusKey": row["status_key"],
        "location": row["location"],
        "partner": row["partner"],
        "impactGoal": row["impact_goal"],
        "description": row["description"],
    }


@router.get("/opportunities")
def list_opportunities() -> List[Dict[str, Any]]:
    with db_session() as conn:
        rows = conn.execute("SELECT * FROM csr_opportunities ORDER BY id ASC").fetchall()
        return [_opp_row_to_dict(r) for r in rows]


@router.get("/pledges")
def list_pledges() -> List[Dict[str, Any]]:
    with db_session() as conn:
        rows = conn.execute("SELECT * FROM csr_pledges ORDER BY created_at DESC").fetchall()
        return [dict(r) for r in rows]


@router.post("/pledges", status_code=status.HTTP_201_CREATED)
def create_csr_pledge(payload: CsrPledgeRequest) -> Dict[str, Any]:
    """Commit CSR co-funding for a societal impact opportunity and issue 80G reference."""
    now_iso = _now_iso()
    with db_session() as conn:
        opp = conn.execute(
            "SELECT * FROM csr_opportunities WHERE id = ?", (payload.opportunityId,)
        ).fetchone()
        if not opp:
            raise HTTPException(status_code=404, detail=f"CSR opportunity '{payload.opportunityId}' not found")

        pledge_id = f"PLG-{uuid.uuid4().hex[:8].upper()}"
        cert_id = f"80G-MCA-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

        conn.execute(
            """
            INSERT INTO csr_pledges (
                id, opportunity_id, partner_name, amount_inr, cin_or_gst,
                compliance_certificate_id, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pledge_id,
                payload.opportunityId,
                payload.partnerName,
                payload.amountInr,
                payload.cinOrGst or "",
                cert_id,
                payload.notes,
                now_iso,
            ),
        )

        new_raised = int(opp["raised_amount_inr"]) + int(payload.amountInr)
        fulfilled = new_raised >= int(opp["target_amount_inr"])
        new_status = "समाधान उपलब्ध" if fulfilled else opp["status"]
        new_status_key = "fulfilled" if fulfilled else opp["status_key"]

        conn.execute(
            """
            UPDATE csr_opportunities
            SET raised_amount_inr = ?, raised_resource = ?, status = ?, status_key = ?
            WHERE id = ?
            """,
            (new_raised, format_inr(new_raised), new_status, new_status_key, payload.opportunityId),
        )

        emit_event(
            conn,
            topic="sankalp.csr.pledges",
            event_type="csr.pledge_committed",
            entity_id=pledge_id,
            payload={
                "opportunityId": payload.opportunityId,
                "partnerName": payload.partnerName,
                "amountInr": payload.amountInr,
                "certificateId": cert_id,
            },
        )
        add_notification(
            conn,
            f"🏢 {payload.partnerName} द्वारा {format_inr(payload.amountInr)} का CSR योगदान प्राप्त हुआ",
            notif_type="csr",
        )

        updated_opp = conn.execute(
            "SELECT * FROM csr_opportunities WHERE id = ?", (payload.opportunityId,)
        ).fetchone()
        return {
            "pledge": {
                "id": pledge_id,
                "opportunityId": payload.opportunityId,
                "partnerName": payload.partnerName,
                "amountInr": payload.amountInr,
                "amountFormatted": format_inr(payload.amountInr),
                "complianceCertificateId": cert_id,
                "createdAt": now_iso,
            },
            "opportunity": _opp_row_to_dict(updated_opp),
        }


@router.post("/partners/verify")
def verify_csr_partner(payload: PartnerVerificationRequest) -> Dict[str, Any]:
    """Verify Industry/CSR partner credentials against CIN/GSTIN/MCA CSR-1 rules (Slide 5)."""
    cin_ok = bool(payload.cin and CIN_REGEX.match(payload.cin.strip().upper()))
    gst_ok = bool(payload.gstin and GSTIN_REGEX.match(payload.gstin.strip().upper()))
    csr1_ok = bool(payload.csrRegistrationNo and CSR1_REGEX.match(payload.csrRegistrationNo.strip().upper()))

    verified = cin_ok or gst_ok or csr1_ok
    if not verified:
        return {
            "verified": False,
            "organizationName": payload.organizationName,
            "checks": {"cinValid": cin_ok, "gstinValid": gst_ok, "mcaCsr1Valid": csr1_ok},
            "message": "Provide a valid 21-char CIN, 15-char GSTIN, or MCA CSR-1 registration number (e.g. CSR00012345).",
        }

    now_iso = _now_iso()
    partner_id = f"csr-{uuid.uuid4().hex[:8]}"
    categories = payload.focusSectors or ["water", "waste", "lights", "roads"]
    identifier = (payload.cin or payload.gstin or payload.csrRegistrationNo or "").strip().upper()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO stakeholders (
                id, name, stakeholder_type, categories_json, location, lat, lng,
                capabilities_json, default_status, historical_success_rate, sla_hours,
                cin_or_gst, verified, created_at
            ) VALUES (?, ?, 'csr', ?, 'Pan-India / Jaipur', 26.9124, 75.7873, ?, 'MCA CSR Verified Partner', 0.90, 48, ?, 1, ?)
            """,
            (
                partner_id,
                payload.organizationName,
                json.dumps(categories),
                json.dumps(["csr_funding", "impact_co_design"]),
                identifier,
                now_iso,
            ),
        )
        emit_event(
            conn,
            topic="sankalp.csr.onboarding",
            event_type="csr.partner_verified",
            entity_id=partner_id,
            payload={"organizationName": payload.organizationName, "identifier": identifier},
        )

    return {
        "verified": True,
        "stakeholderId": partner_id,
        "organizationName": payload.organizationName,
        "checks": {"cinValid": cin_ok, "gstinValid": gst_ok, "mcaCsr1Valid": csr1_ok},
        "mcaPortalRef": "https://www.csr.gov.in/content/csr/global/master/home/home.html",
        "message": "Partner verified and onboarded to SANKALP CSR Smart Routing registry.",
    }
