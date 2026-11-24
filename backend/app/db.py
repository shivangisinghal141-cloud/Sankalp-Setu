from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Generator, List

from app.config import settings
from app.services.privacy import hash_password, hash_phone


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_connection(db_path: Path | str | None = None) -> sqlite3.Connection:
    target = Path(db_path or settings.db_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(target), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


@contextmanager
def db_session(db_path: Path | str | None = None) -> Generator[sqlite3.Connection, None, None]:
    conn = get_connection(db_path)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    category TEXT NOT NULL,
    category_key TEXT NOT NULL,
    location TEXT NOT NULL,
    location_en TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    status_key TEXT NOT NULL,
    priority TEXT NOT NULL,
    priority_key TEXT NOT NULL,
    severity_score INTEGER NOT NULL DEFAULT 50,
    routing_tier TEXT NOT NULL DEFAULT 'joint_hei_csr_fast_track',
    citizen_name TEXT NOT NULL,
    citizen_phone TEXT NOT NULL DEFAULT '',
    citizen_phone_hash TEXT NOT NULL DEFAULT '',
    dpdp_consent INTEGER NOT NULL DEFAULT 1,
    intake_channel TEXT NOT NULL DEFAULT 'web_app',
    language TEXT NOT NULL DEFAULT 'hi',
    description TEXT NOT NULL,
    ai_confidence INTEGER NOT NULL DEFAULT 90,
    duplicate_count INTEGER NOT NULL DEFAULT 1,
    duplicate_of TEXT,
    assigned_dept TEXT NOT NULL,
    dept_id TEXT NOT NULL,
    matched_stakeholders_json TEXT NOT NULL,
    ai_routing_reasoning_json TEXT NOT NULL,
    timeline_json TEXT NOT NULL,
    questionnaire_json TEXT NOT NULL DEFAULT '{}',
    evidence_json TEXT NOT NULL DEFAULT '{}',
    nlp_insights_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stakeholders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stakeholder_type TEXT NOT NULL,
    categories_json TEXT NOT NULL,
    location TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    capabilities_json TEXT NOT NULL,
    default_status TEXT NOT NULL,
    historical_success_rate REAL NOT NULL DEFAULT 0.90,
    sla_hours INTEGER NOT NULL DEFAULT 48,
    cin_or_gst TEXT DEFAULT '',
    verified INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS university_challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    priority TEXT NOT NULL,
    reports_count INTEGER NOT NULL DEFAULT 1,
    reports_label TEXT NOT NULL,
    description TEXT NOT NULL,
    linked_issue_id TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS university_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hi TEXT,
    category TEXT NOT NULL,
    university TEXT NOT NULL,
    problem_ref TEXT NOT NULL,
    location TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 15,
    status TEXT NOT NULL,
    lead_student TEXT NOT NULL,
    mentor TEXT NOT NULL,
    funding_status TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS csr_opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    category TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    target_amount_inr INTEGER NOT NULL,
    raised_resource TEXT NOT NULL,
    raised_amount_inr INTEGER NOT NULL,
    status TEXT NOT NULL,
    status_key TEXT NOT NULL,
    location TEXT NOT NULL,
    partner TEXT NOT NULL,
    impact_goal TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS csr_pledges (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    amount_inr INTEGER NOT NULL,
    cin_or_gst TEXT DEFAULT '',
    compliance_certificate_id TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (opportunity_id) REFERENCES csr_opportunities(id)
);

CREATE TABLE IF NOT EXISTS collaboration_milestones (
    id TEXT PRIMARY KEY,
    issue_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    owner_type TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    time_label TEXT NOT NULL,
    type TEXT NOT NULL,
    issue_id TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_logs (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    event_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    full_name TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def issue_row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    q = json.loads(row["questionnaire_json"] or "{}")
    ev = json.loads(row["evidence_json"] or "{}")
    return {
        "id": row["id"],
        "title": row["title"],
        "titleEn": row["title_en"],
        "category": row["category"],
        "categoryKey": row["category_key"],
        "location": row["location"],
        "locationEn": row["location_en"],
        "lat": row["lat"],
        "lng": row["lng"],
        "date": row["date"],
        "status": row["status"],
        "statusKey": row["status_key"],
        "priority": row["priority"],
        "priorityKey": row["priority_key"],
        "severityScore": row["severity_score"],
        "routingTier": row["routing_tier"],
        "citizenName": row["citizen_name"],
        "citizenPhone": row["citizen_phone"],
        "dpdpConsent": bool(row["dpdp_consent"]),
        "intakeChannel": row["intake_channel"],
        "language": row["language"],
        "description": row["description"],
        "aiConfidence": row["ai_confidence"],
        "duplicateCount": row["duplicate_count"],
        "duplicateOf": row["duplicate_of"],
        "assignedDept": row["assigned_dept"],
        "deptId": row["dept_id"],
        "matchedStakeholders": json.loads(row["matched_stakeholders_json"]),
        "aiRoutingReasoning": json.loads(row["ai_routing_reasoning_json"]),
        "timeline": json.loads(row["timeline_json"]),
        "affectedPeople": q.get("affectedPeople", ""),
        "immediateDanger": q.get("immediateDanger", ""),
        "damageDescription": q.get("damageDescription", ""),
        "duration": q.get("duration", ""),
        "impactLevel": q.get("impactLevel", ""),
        "evidenceChoice": q.get("evidenceChoice", ""),
        "voiceAnswer": q.get("voiceAnswer", {}),
        "photoEvidence": ev.get("photoEvidence"),
        "videoEvidence": ev.get("videoEvidence"),
        "nlpInsights": json.loads(row["nlp_insights_json"] or "{}"),
    }


def format_inr(amount: int) -> str:
    s = str(max(0, int(amount)))
    if len(s) <= 3:
        return f"₹{s}"
    last3 = s[-3:]
    rest = s[:-3]
    parts: List[str] = []
    while len(rest) > 2:
        parts.append(rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.append(rest)
    return "₹" + ",".join(reversed(parts)) + "," + last3


def init_db(db_path: Path | str | None = None) -> None:
    with db_session(db_path) as conn:
        conn.executescript(SCHEMA_SQL)
        _seed_initial_data(conn)


def _seed_initial_data(conn: sqlite3.Connection) -> None:
    now = _now_iso()

    # Seed admin users (matches AdminDashboard.jsx demo credentials + standard aliases)
    admin_count = conn.execute("SELECT COUNT(*) FROM admin_users").fetchone()[0]
    if admin_count == 0:
        default_hash = hash_password("sankalp2026")
        for uid, uname, name in [
            ("ADM-01", "admin@sankalp.gov.in", "Command Center Officer"),
            ("ADM-02", "ADMIN2026", "State Nodal Admin"),
            ("ADM-03", "admin", "Platform Administrator"),
        ]:
            conn.execute(
                """
                INSERT INTO admin_users (id, username, password_hash, role, full_name, created_at)
                VALUES (?, ?, ?, 'admin', ?, ?)
                """,
                (uid, uname, default_hash, name, now),
            )

    # Seed Stakeholders (Govt Dept + HEI IIC + Industry/CSR)
    if conn.execute("SELECT COUNT(*) FROM stakeholders").fetchone()[0] == 0:
        stakeholders = [
            ("gov-water", "राजस्थान जल बोर्ड (PHED)", "government", ["water"], "जयपुर वृत्त कार्यालय", 26.9150, 75.7920, ["pipeline_repair", "water_quality", "emergency_tanker"], "सत्यापन हेतु आवंटित", 0.94, 24, "", 1),
            ("gov-waste", "जयपुर नगर निगम (स्वास्थ्य शाखा)", "government", ["waste"], "मानसरोवर जोन कार्यालय", 26.8540, 75.7700, ["solid_waste", "iot_bins", "sanitation_drive"], "सत्यापित व असाइन", 0.91, 48, "", 1),
            ("gov-power", "जयपुर विकास प्राधिकरण (विद्युत)", "government", ["lights", "electricity"], "सांगानेर विद्युत डिवीजन", 26.8150, 75.8040, ["led_grid", "solar_lights", "transformer_repair"], "विद्युत दल आवंटित", 0.95, 24, "", 1),
            ("gov-roads", "राजस्थान लोक निर्माण विभाग (PWD)", "government", ["roads"], "अशोक नगर, जयपुर", 26.9060, 75.7980, ["road_patching", "drainage", "bridge_safety"], "समीक्षाधीन", 0.90, 72, "", 1),
            ("gov-health", "मुख्य चिकित्सा एवं स्वास्थ्य अधिकारी (CMHO)", "government", ["health"], "एसएमएस जोन, जयपुर", 26.9000, 75.8100, ["vector_control", "mobile_clinic", "sanitation"], "स्वास्थ्य दल सक्रिय", 0.93, 12, "", 1),
            ("univ-mnit", "MNIT Jaipur (IIC Cell)", "university", ["water", "roads", "electricity"], "जेएलएन मार्ग, जयपुर", 26.8639, 75.8108, ["iot_sensors", "smart_water", "structural_audit"], "Smart Monitoring Pilot Proposed", 0.92, 72, "", 1),
            ("univ-jnu", "Jaipur National University (IIC)", "university", ["waste", "health"], "जगतपुरा, जयपुर", 26.8560, 75.8550, ["cv_waste_sorting", "biotech_sanitation"], "AI Waste Lab Review", 0.89, 72, "", 1),
            ("univ-poornima", "Poornima Institute of Engineering (IIC)", "university", ["lights", "electricity"], "सीतापुरा, जयपुर", 26.7820, 75.8220, ["solar_mesh", "motion_sensors"], "Solar Mesh Prototype Ready", 0.94, 48, "", 1),
            ("univ-lnmiit", "LNM Institute of IT (IIC)", "university", ["roads", "water"], "जामडोली, जयपुर", 26.9360, 75.9230, ["pothole_cv", "gis_analytics"], "Camera Detection Pilot", 0.88, 72, "", 1),
            ("csr-tata", "TATA Trust Clean Water CSR", "csr", ["water", "health"], "जयपुर क्षेत्रीय कार्यालय", 26.9100, 75.7900, ["clean_water_funding", "filtration_units"], "Funding Approved ₹12L", 0.93, 48, "L99999MH1995PLC089100", 1),
            ("csr-ecogreen", "EcoGreen India Foundation CSR", "csr", ["waste"], "मानसरोवर, जयपुर", 26.8500, 75.7650, ["recycling_units", "smart_bins"], "Recycling Unit Proposal ₹8.5L", 0.89, 72, "U74999RJ2018NPL061234", 1),
            ("csr-havells", "Havells India CSR Foundation", "csr", ["lights", "electricity"], "सांगानेर औद्योगिक क्षेत्र", 26.8100, 75.8000, ["solar_streetlights", "safety_lighting"], "CSR Equipment Ready", 0.96, 48, "L31900DL1983PLC016304", 1),
            ("csr-ultratech", "UltraTech Cement CSR", "csr", ["roads"], "अशोक नगर, जयपुर", 26.9040, 75.7990, ["rapid_road_repair", "concrete_infra"], "Rapid Repair Material Ready", 0.90, 48, "L26940MH2000PLC128420", 1),
        ]
        for s in stakeholders:
            conn.execute(
                """
                INSERT INTO stakeholders (
                    id, name, stakeholder_type, categories_json, location, lat, lng,
                    capabilities_json, default_status, historical_success_rate, sla_hours,
                    cin_or_gst, verified, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (s[0], s[1], s[2], json.dumps(s[3]), s[4], s[5], s[6], json.dumps(s[7]), s[8], s[9], s[10], s[11], s[12], now),
            )

    # Seed initial issues matching mockData.js
    if conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0] == 0:
        seed_issues = [
            {
                "id": "SNK-2026-0012",
                "title": "जल आपूर्ति समस्या एवं पाइपलाइन रिसाव",
                "title_en": "Water Supply Disruption & Pipeline Leakage",
                "category": "जल आपूर्ति",
                "category_key": "water",
                "location": "वार्ड 26, वैशाली, जयपुर",
                "location_en": "Ward 26, Vaishali Nagar, Jaipur",
                "lat": 26.9124,
                "lng": 75.7873,
                "date": "2026-09-02",
                "status": "प्रगति पर",
                "status_key": "in_progress",
                "priority": "उच्च",
                "priority_key": "high",
                "severity_score": 88,
                "routing_tier": "immediate_multi_stakeholder_alert",
                "citizen_name": "रमेश कुमार शर्मा",
                "citizen_phone": "98765*****",
                "description": "पिछले 4 दिनों से पेयजल आपूर्ति बाधित है तथा मुख्य पाइपलाइन में भारी रिसाव हो रहा है जिससे सड़कों पर जल भराव हो गया है।",
                "ai_confidence": 96,
                "duplicate_count": 7,
                "assigned_dept": "जल स्वास्थ्य एवं अभियांत्रिकी विभाग (PHED)",
                "dept_id": "gov-water",
                "matched_stakeholders": {
                    "government": {"id": "gov-water", "name": "राजस्थान जल बोर्ड (PHED)", "match": 96, "status": "कार्य प्रगति पर", "distanceKm": 2.3},
                    "university": {"id": "univ-mnit", "name": "MNIT Jaipur (IIC Cell)", "match": 89, "status": "Smart Monitoring Pilot Proposed", "distanceKm": 5.8},
                    "csr": {"id": "csr-tata", "name": "TATA Trust Clean Water CSR", "match": 82, "status": "Funding Approved ₹12L", "distanceKm": 1.1},
                },
                "ai_routing_reasoning": [
                    "स्थानिक निकटता: पीएचईडी जयपुर वृत्त कार्यालय से 2.3 किमी की दूरी पर है।",
                    "तकनीकी क्षमता: पीएचईडी के पास भारी रिसाव मरम्मत का विशेषज्ञ दल उपलब्ध है।",
                    "एआई पैटर्न: इस क्षेत्र में पिछले 3 महीनों में 7 समान शिकायतें दर्ज की गई हैं।",
                    "संसाधन संरेखण: टाटा ट्रस्ट द्वारा समर्थित पेयजल सीएसआर निधि उपलब्ध है।",
                    "विश्वविद्यालय सहयोग: एमएनआईटी जयपुर ने आईआईसी के तहत जल सेंसर निगरानी का समाधान पेश किया है।",
                ],
                "timeline": [
                    {"step": "दर्ज", "date": "2026-09-02 09:15 AM", "completed": True, "desc": "नागरिक द्वारा समस्या दर्ज की गई"},
                    {"step": "AI विश्लेषण", "date": "2026-09-02 09:16 AM", "completed": True, "desc": "AI द्वारा श्रेणी जल आपूर्ति (96% सटीकता) निर्धारित की गई"},
                    {"step": "सत्यापन", "date": "2026-09-02 10:30 AM", "completed": True, "desc": "नोडल अधिकारी द्वारा सत्यापन पूर्ण"},
                    {"step": "सही संस्था", "date": "2026-09-02 11:45 AM", "completed": True, "desc": "राजस्थान PHED व CSR पार्टनर को स्मार्ट रूट किया गया"},
                    {"step": "समाधान", "date": "प्रगति पर", "completed": False, "current": True, "desc": "पाइपलाइन मरम्मत कार्य जारी है"},
                    {"step": "प्रभाव", "date": "लंबित", "completed": False, "desc": "सत्यापन उपरांत प्रभाव मूल्यांकन किया जाएगा"},
                ],
            },
            {
                "id": "SNK-2026-0015",
                "title": "स्मार्ट कचरा प्रबंधन व अवैध डंपिंग",
                "title_en": "Waste Accumulation & Illegal Dumping",
                "category": "कचरा प्रबंधन",
                "category_key": "waste",
                "location": "वार्ड 14, मानसरोवर, जयपुर",
                "location_en": "Ward 14, Mansarovar, Jaipur",
                "lat": 26.8524,
                "lng": 75.7673,
                "date": "2026-09-03",
                "status": "सत्यापित",
                "status_key": "verified",
                "priority": "मध्यम",
                "priority_key": "medium",
                "severity_score": 66,
                "routing_tier": "joint_hei_csr_fast_track",
                "citizen_name": "सुनीता देवी",
                "citizen_phone": "97654*****",
                "description": "मुख्य बाज़ार के निकट कचरा पात्र ओवरफ्लो हो रहे हैं और दुर्गंध से आमजन परेशान हैं।",
                "ai_confidence": 92,
                "duplicate_count": 8,
                "assigned_dept": "नगर निगम स्वास्थ्य शाखा",
                "dept_id": "gov-waste",
                "matched_stakeholders": {
                    "government": {"id": "gov-waste", "name": "जयपुर नगर निगम (दक्षिण)", "match": 94, "status": "सत्यापित व असाइन", "distanceKm": 1.8},
                    "university": {"id": "univ-jnu", "name": "Jaipur National Univ Waste Lab", "match": 91, "status": "AI Waste Sorting Challenge Accepted", "distanceKm": 8.6},
                    "csr": {"id": "csr-ecogreen", "name": "EcoGreen India CSR", "match": 85, "status": "Recycling Unit Proposal ₹8.5L", "distanceKm": 0.9},
                },
                "ai_routing_reasoning": [
                    "डोमेन मैच: नगर निगम ठोस अपशिष्ट प्रबंधन विभाग।",
                    "आरएंडडी संरेखण: जेएनयू की पर्यावरण विज्ञान लैब कचरा प्रसंस्करण प्रोजेक्ट पर कार्यरत है।",
                    "पर्यावरण प्रभाव: उच्च जनसंख्या घनत्व वाले व्यावसायिक क्षेत्र।",
                ],
                "timeline": [
                    {"step": "दर्ज", "date": "2026-09-03 08:30 AM", "completed": True, "desc": "मोबाइल ऐप द्वारा फोटो सहित रिपोर्ट की गई"},
                    {"step": "AI विश्लेषण", "date": "2026-09-03 08:31 AM", "completed": True, "desc": "कचरा प्रबंधन श्रेणी स्वीकृत"},
                    {"step": "सत्यापन", "date": "2026-09-03 10:00 AM", "completed": True, "desc": "स्वच्छता निरीक्षक द्वारा सत्यापन किया गया"},
                    {"step": "सही संस्था", "date": "2026-09-03 10:15 AM", "completed": True, "desc": "नगर निगम वाहन दल को अलर्ट भेजा गया"},
                    {"step": "समाधान", "date": "प्रक्रियाधीन", "completed": False, "current": True, "desc": "सफाई वाहन रवाना"},
                    {"step": "प्रभाव", "date": "लंबित", "completed": False, "desc": ""},
                ],
            },
            {
                "id": "SNK-2026-0009",
                "title": "स्ट्रीट लाइट खराबी एवं सुरक्षा जोखिम",
                "title_en": "Faulty Streetlights & Safety Hazard",
                "category": "स्ट्रीट लाइट",
                "category_key": "lights",
                "location": "वार्ड 12, सांगानेर, जयपुर",
                "location_en": "Ward 12, Sanganer, Jaipur",
                "lat": 26.8124,
                "lng": 75.8073,
                "date": "2026-09-01",
                "status": "समाधान",
                "status_key": "resolved",
                "priority": "उच्च",
                "priority_key": "high",
                "severity_score": 84,
                "routing_tier": "immediate_multi_stakeholder_alert",
                "citizen_name": "अमित वर्मा",
                "citizen_phone": "94140*****",
                "description": "बस स्टैंड के पास पिछले 10 दिनों से 15 एलईडी लाइटें बंद पड़ी हैं, जिससे रात में दुर्घटना व सुरक्षा का खतरा है।",
                "ai_confidence": 98,
                "duplicate_count": 15,
                "assigned_dept": "नगर निगम विद्युत शाखा",
                "dept_id": "gov-power",
                "matched_stakeholders": {
                    "government": {"id": "gov-power", "name": "जयपुर विकास प्राधिकरण (विद्युत)", "match": 98, "status": "लाइटें बदली गईं", "distanceKm": 1.2},
                    "university": {"id": "univ-poornima", "name": "Poornima College IIC", "match": 88, "status": "Solar Sensor Installed", "distanceKm": 3.5},
                    "csr": {"id": "csr-havells", "name": "Havells India CSR", "match": 95, "status": "Provided 20 Solar Lights", "distanceKm": 1.4},
                },
                "ai_routing_reasoning": [
                    "उच्च सुरक्षा संरेखण: रात्रि सुरक्षा संवेदनशील क्षेत्र।",
                    "हेवेल्स सीएसआर द्वारा सोलर लाइट योगदान।",
                    "त्वरित निस्तारण: 48 घंटे के भीतर मरम्मत निष्पादित।",
                ],
                "timeline": [
                    {"step": "दर्ज", "date": "2026-09-01 07:00 PM", "completed": True, "desc": "कॉलसेंटर IVR द्वारा दर्ज"},
                    {"step": "AI विश्लेषण", "date": "2026-09-01 07:01 PM", "completed": True, "desc": "उच्च प्राथमिकता सुरक्षा श्रेणी"},
                    {"step": "सत्यापन", "date": "2026-09-02 09:00 AM", "completed": True, "desc": "जेडीए इंजीनियर द्वारा सत्यापित"},
                    {"step": "सही संस्था", "date": "2026-09-02 09:30 AM", "completed": True, "desc": "विद्युत ठेकेदार को आदेशित"},
                    {"step": "समाधान", "date": "2026-09-03 04:00 PM", "completed": True, "desc": "15 लाइटें सफलतापूर्वक बदली गईं"},
                    {"step": "प्रभाव", "date": "2026-09-03 06:00 PM", "completed": True, "desc": "नागरिक द्वारा 5-स्टार फीडबैक प्राप्त"},
                ],
            },
            {
                "id": "SNK-2026-0021",
                "title": "सड़क गड्ढे एवं दुर्घटना स्थल",
                "title_en": "Pothole Repair & Road Hazards",
                "category": "सड़क एवं आधारभूत संरचना",
                "category_key": "roads",
                "location": "सी-स्कीम, अशोक नगर, जयपुर",
                "location_en": "C-Scheme, Ashok Nagar, Jaipur",
                "lat": 26.9050,
                "lng": 75.8000,
                "date": "2026-09-04",
                "status": "दर्ज",
                "status_key": "registered",
                "priority": "उच्च",
                "priority_key": "high",
                "severity_score": 82,
                "routing_tier": "immediate_multi_stakeholder_alert",
                "citizen_name": "डॉ. वी. के. गुप्ता",
                "citizen_phone": "98290*****",
                "description": "बारिश के कारण मुख्य चौराहे पर गहरा गड्ढा हो गया है, जहाँ प्रतिदिन दोपहिया वाहन गिर रहे हैं।",
                "ai_confidence": 95,
                "duplicate_count": 3,
                "assigned_dept": "सार्वजनिक निर्माण विभाग (PWD)",
                "dept_id": "gov-roads",
                "matched_stakeholders": {
                    "government": {"id": "gov-roads", "name": "राजस्थान लोक निर्माण विभाग (PWD)", "match": 97, "status": "समीक्षाधीन", "distanceKm": 0.9},
                    "university": {"id": "univ-lnmiit", "name": "LNM Institute of IT (IIC)", "match": 86, "status": "Pothole Detection Camera Model", "distanceKm": 12.4},
                    "csr": {"id": "csr-ultratech", "name": "UltraTech Cement CSR", "match": 90, "status": "Rapid Repair Material Ready", "distanceKm": 0.6},
                },
                "ai_routing_reasoning": [
                    "सार्वजनिक सुरक्षा जोखिम: भारी यातायात चौराहा।",
                    "पीडब्ल्यूडी और अल्ट्राटेक सीएसआर त्वरित सामग्री आपूर्ति के लिए कनेक्टेड।",
                ],
                "timeline": [
                    {"step": "दर्ज", "date": "2026-09-04 07:30 AM", "completed": True, "desc": "नागरिक द्वारा दर्ज"},
                    {"step": "AI विश्लेषण", "date": "2026-09-04 07:31 AM", "completed": True, "desc": "AI द्वारा सड़क मरम्मत श्रेणी चिन्हित"},
                    {"step": "सत्यापन", "date": "लंबित", "completed": False, "current": True, "desc": "नोडल अधिकारी आवंटन जारी"},
                    {"step": "सही संस्था", "date": "लंबित", "completed": False, "desc": ""},
                    {"step": "समाधान", "date": "लंबित", "completed": False, "desc": ""},
                    {"step": "प्रभाव", "date": "लंबित", "completed": False, "desc": ""},
                ],
            },
        ]

        for item in seed_issues:
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
                    item["id"], item["title"], item["title_en"], item["category"], item["category_key"],
                    item["location"], item["location_en"], item["lat"], item["lng"], item["date"],
                    item["status"], item["status_key"], item["priority"], item["priority_key"],
                    item["severity_score"], item["routing_tier"], item["citizen_name"], item["citizen_phone"],
                    hash_phone(item["citizen_phone"]), 1, "web_app", "hi", item["description"],
                    item["ai_confidence"], item["duplicate_count"], None, item["assigned_dept"],
                    item["dept_id"], json.dumps(item["matched_stakeholders"], ensure_ascii=False),
                    json.dumps(item["ai_routing_reasoning"], ensure_ascii=False),
                    json.dumps(item["timeline"], ensure_ascii=False),
                    "{}", "{}", "{}", now, now,
                ),
            )

    # Seed University Challenges
    if conn.execute("SELECT COUNT(*) FROM university_challenges").fetchone()[0] == 0:
        challenges = [
            ("CHAL-2026-01", "जल प्रबंधन व पाइपलाइन लीकेज स्मार्ट निगरानी", "जल प्रबंधन", "📍 वार्ड 26, वैशाली, जयपुर", "🔴 उच्च", 12, "12 नागरिक रिपोर्ट", "पेयजल की बर्बादी रोकने हेतु कम लागत वाले आईओटी प्रेशर एवं फ्लो सेंसर ग्रिड का विकास।", "SNK-2026-0012"),
            ("CHAL-2026-02", "एआई आधारित कचरा वर्गीकरण व डंपिंग अलर्ट", "कचरा प्रबंधन", "📍 वार्ड 14, मानसरोवर, जयपुर", "🟠 मध्यम", 8, "8 नागरिक रिपोर्ट", "स्मार्ट डस्टबिन में कैमरा विज़न सेंसर द्वारा सूखा व गीला कचरा ऑटोमैटिक पृथक्कीकरण।", "SNK-2026-0015"),
            ("CHAL-2026-03", "सोलर मेश स्ट्रीट लाइट व सुरक्षा सेंसर", "स्ट्रीट लाइट", "📍 वार्ड 12, सांगानेर, जयपुर", "🔴 उच्च", 15, "15 नागरिक रिपोर्ट", "स्वचालित सौर संचालित एलईडी ग्रिड जो मोशन डिटेक्शन एवं सुरक्षा अलर्ट सपोर्ट करता है।", "SNK-2026-0009"),
        ]
        for ch in challenges:
            conn.execute(
                """
                INSERT INTO university_challenges (
                    id, title, category, location, priority, reports_count,
                    reports_label, description, linked_issue_id, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
                """,
                (*ch, now),
            )

    # Seed University Projects
    if conn.execute("SELECT COUNT(*) FROM university_projects").fetchone()[0] == 0:
        projects = [
            ("UNIV-PRJ-101", "Smart Water Leakage & Quality Monitoring Sensor", "स्मार्ट जल रिसाव एवं गुणवत्ता निगरानी सेंसर", "जल प्रबंधन", "MNIT Jaipur (IIC Cell)", "SNK-2026-0012", "वार्ड 26, वैशाली, जयपुर", 60, "प्रोटोटाइप परीक्षण", "आयुष शर्मा (M.Tech IoT)", "डॉ. ए. के. चौधरी", "CSR द्वारा ₹3.5 लाख स्वीकृत", "पाइपलाइन के प्रेशर ड्रॉप तथा लीकेज का रियल-टाइम अलर्ट देने हेतु लो-कॉस्ट आईओटी सेंसर डिवेलपमेंट।"),
            ("UNIV-PRJ-102", "AI Based Dry & Wet Waste Automatic Classifier", "AI आधारित सूखा व गीला कचरा ऑटोमैटिक वर्गीकरण", "कचरा प्रबंधन", "Jaipur National University (IIC)", "SNK-2026-0015", "वार्ड 14, मानसरोवर, जयपुर", 25, "अनुसंधान एवं विकास", "नेहा अग्रवाल (B.Tech AI)", "प्रो. आर. एस. राठौड़", "प्रस्तावित ₹2.0 लाख", "स्मार्ट डस्टबिन में कंप्यूटर विजन द्वारा कचरा पृथक्कीकरण प्रणाली।"),
            ("UNIV-PRJ-103", "Solar Smart Light Mesh with Security Motion Detector", "सोलर स्मार्ट लाइट मेश व सुरक्षा मोशन डिटेक्टर", "स्ट्रीट लाइट", "Poornima Institute of Engineering", "SNK-2026-0009", "सांगानेर, जयपुर", 90, "सफलतापूर्वक स्थापित", "विक्रम मीणा", "डॉ. एस. के. सिंह", "Havells CSR द्वारा ₹4.0 लाख पोषित", "स्वचालित सौर ऊर्जा संचालित स्मार्ट स्ट्रीट लाइट ग्रिड।"),
        ]
        for prj in projects:
            conn.execute(
                """
                INSERT INTO university_projects (
                    id, title, title_hi, category, university, problem_ref, location,
                    progress, status, lead_student, mentor, funding_status, description,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (*prj, now, now),
            )

    # Seed CSR Opportunities
    if conn.execute("SELECT COUNT(*) FROM csr_opportunities").fetchone()[0] == 0:
        opps = [
            ("CSR-OPP-201", "ग्रामीण व शहरी जल प्रबंधन संवर्धन पहल", "Rural & Urban Water Resource Enhancement Initiative", "जल प्रबंधन", "₹12,00,000", 1200000, "₹9,80,000", 980000, "सहयोग आवश्यक", "needed", "जयपुर एवं आसपास के क्षेत्र", "TATA Trusts & PHED Rajasthan", "50,000 नागरिकों को स्वच्छ पेयजल आपूर्ति सुनिश्चित करना", "नागरिक शिकायतों के त्वरित निस्तारण हेतु आधुनिक जल रिसाव मरम्मत उपकरण एवं स्मार्ट जल फिल्टर इकाइयाँ स्थापित करना।"),
            ("CSR-OPP-202", "प्लास्टिक वेस्ट रीसाइक्लिंग व स्मार्ट डस्टबिन यूनिट", "Plastic Waste Recycling & Smart Dustbin Deployment", "कचरा प्रबंधन", "₹8,50,000", 850000, "₹8,50,000", 850000, "समाधान उपलब्ध", "fulfilled", "जयपुर नगर निगम क्षेत्र", "EcoGreen India Foundation", "10 मीट्रिक टन प्लास्टिक कचरे का पुनर्चक्रण", "विश्वविद्यालयों द्वारा विकसित एआई वर्गीकरण मशीनों की विनिर्माण एवं स्थापना लागत।"),
            ("CSR-OPP-203", "सोलर स्ट्रीट लाइट व नागरिक सुरक्षा पहल", "Solar Street Light Installation for Citizen Safety", "स्ट्रीट लाइट", "₹15,00,000", 1500000, "₹11,20,000", 1120000, "समर्थन आवश्यक", "needed", "सांगानेर व बाहरी वार्ड", "Havells CSR Foundation", "100 कम रोशनी वाले चौराहों को जगमगाना", "अंधेरे क्षेत्रों में सोलर स्मार्ट लाइट स्थापित कर महिला व नागरिक सुरक्षा सुदृढ़ करना।"),
        ]
        for opp in opps:
            conn.execute(
                """
                INSERT INTO csr_opportunities (
                    id, title, title_en, category, target_resource, target_amount_inr,
                    raised_resource, raised_amount_inr, status, status_key, location,
                    partner, impact_goal, description, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (*opp, now),
            )

    # Seed Collaboration Milestones
    if conn.execute("SELECT COUNT(*) FROM collaboration_milestones").fetchone()[0] == 0:
        milestones = [
            ("MIL-101", "SNK-2026-0012", "Co-design", "university", "MNIT Jaipur (IIC Cell)", "IoT pressure drop & acoustic leak sensor blueprint shared with PHED engineers", 1),
            ("MIL-102", "SNK-2026-0012", "Funding", "csr", "TATA Trust Clean Water CSR", "Approved ₹12L co-funding tranche for pipeline repair & sensor pilot", 1),
            ("MIL-103", "SNK-2026-0012", "Testing / Pilot", "government", "राजस्थान जल बोर्ड (PHED)", "Field deployment & pressure test underway in Ward 26 Vaishali Nagar", 0),
        ]
        for m in milestones:
            conn.execute(
                """
                INSERT INTO collaboration_milestones (
                    id, issue_id, phase, owner_type, owner_name, summary, completed, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (*m, now),
            )

    # Seed Notifications
    if conn.execute("SELECT COUNT(*) FROM notifications").fetchone()[0] == 0:
        for text, tlabel, ntype, iid in [
            ("नई जल आपूर्ति शिकायत SNK-2026-0021 दर्ज हुई", "अभी", "new", "SNK-2026-0021"),
            ("AI स्मार्ट रूटिंग ने राजस्थान PHED को 96% मैच किया", "2 मिनट पहले", "ai", "SNK-2026-0012"),
            ("Havells CSR द्वारा ₹4.0 लाख का योगदान प्राप्त हुआ", "10 मिनट पहले", "csr", "SNK-2026-0009"),
        ]:
            conn.execute(
                """
                INSERT INTO notifications (text, time_label, type, issue_id, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (text, tlabel, ntype, iid, now),
            )
