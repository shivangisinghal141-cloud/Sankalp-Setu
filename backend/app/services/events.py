from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def emit_event(
    conn: sqlite3.Connection,
    topic: str,
    event_type: str,
    entity_id: str,
    payload: Dict[str, Any],
) -> str:
    """Persist an event onto the Kafka-compatible internal event log."""
    event_id = f"EVT-{uuid.uuid4().hex[:10].upper()}"
    conn.execute(
        """
        INSERT INTO event_logs (id, topic, event_type, entity_id, payload_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (event_id, topic, event_type, entity_id, json.dumps(payload, ensure_ascii=False), _now_iso()),
    )
    return event_id


def add_notification(
    conn: sqlite3.Connection,
    text: str,
    notif_type: str = "info",
    time_label: str = "अभी",
    issue_id: Optional[str] = None,
) -> int:
    """Insert a live dashboard notification."""
    cursor = conn.execute(
        """
        INSERT INTO notifications (text, time_label, type, issue_id, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (text, time_label, notif_type, issue_id, _now_iso()),
    )
    return int(cursor.lastrowid)


def dispatch_priority_alerts(
    conn: sqlite3.Connection,
    issue_id: str,
    routing_tier: str,
    priority_key: str,
    matched_stakeholders: Dict[str, Any],
) -> None:
    """Dispatch priority-tiered notifications and alert events as specified in Slide 3."""
    gov_name = matched_stakeholders.get("government", {}).get("name", "Nodal Govt Dept")
    univ_name = matched_stakeholders.get("university", {}).get("name", "HEI IIC Cell")
    csr_name = matched_stakeholders.get("csr", {}).get("name", "CSR Partner")

    if priority_key == "high":
        alert_msg = (
            f"🚨 HIGH PRIORITY ALERT ({issue_id}): SMS/Email/Push dispatched to "
            f"{gov_name}, {univ_name}, and {csr_name}"
        )
        add_notification(conn, alert_msg, notif_type="alert", time_label="अभी", issue_id=issue_id)
        emit_event(
            conn,
            topic="sankalp.alerts.high_priority",
            event_type="alert.multi_stakeholder_dispatched",
            entity_id=issue_id,
            payload={
                "channels": ["sms", "email", "dashboard_push"],
                "recipients": [gov_name, univ_name, csr_name],
                "routingTier": routing_tier,
            },
        )
    elif priority_key == "medium":
        msg = f"⚡ FAST-TRACK ({issue_id}): Jointly routed to {univ_name} + {csr_name}"
        add_notification(conn, msg, notif_type="ai", time_label="अभी", issue_id=issue_id)
        emit_event(
            conn,
            topic="sankalp.routing.medium_priority",
            event_type="routing.joint_fast_tracked",
            entity_id=issue_id,
            payload={"recipients": [gov_name, univ_name, csr_name], "routingTier": routing_tier},
        )
    else:
        msg = f"🎓 RESEARCH QUEUE ({issue_id}): Queued for HEI/IIC uptake at {univ_name}"
        add_notification(conn, msg, notif_type="university", time_label="अभी", issue_id=issue_id)
        emit_event(
            conn,
            topic="sankalp.routing.low_priority",
            event_type="routing.hei_research_queued",
            entity_id=issue_id,
            payload={"recipient": univ_name, "routingTier": routing_tier},
        )
