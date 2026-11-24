from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import numpy as np


CATEGORY_DEFS: Dict[str, Dict[str, Any]] = {
    "water": {
        "hi": "जल आपूर्ति",
        "en": "Water Supply",
        "dept": "जल स्वास्थ्य एवं अभियांत्रिकी विभाग (PHED)",
        "deptId": "gov-water",
        "keywords": [
            "जल", "पानी", "पाइपलाइन", "रिसाव", "पेयजल", "टंकी", "हैंडपंप", "बोरवेल", "सीवर",
            "water", "pipeline", "leak", "leakage", "drinking", "tap", "supply", "borewell", "phed",
        ],
    },
    "roads": {
        "hi": "सड़क एवं आधारभूत संरचना",
        "en": "Roads & Infrastructure",
        "dept": "लोक निर्माण विभाग (PWD)",
        "deptId": "gov-roads",
        "keywords": [
            "सड़क", "सड़क", "गड्ढा", "गड्ढे", "पुल", "नाली", "जलभराव", "निर्माण", "फुटपाथ",
            "road", "pothole", "bridge", "drain", "highway", "street", "infrastructure", "pwd",
        ],
    },
    "waste": {
        "hi": "कचरा प्रबंधन",
        "en": "Solid Waste Management",
        "dept": "नगर निगम स्वास्थ्य शाखा",
        "deptId": "gov-waste",
        "keywords": [
            "कचरा", "गंदगी", "डंपिंग", "कूड़ा", "सफाई", "डस्टबिन", "प्लास्टिक", "दुर्गंध",
            "waste", "garbage", "dumping", "trash", "dustbin", "sanitation", "plastic", "cleanliness",
        ],
    },
    "lights": {
        "hi": "स्ट्रीट लाइट",
        "en": "Street Lights",
        "dept": "नगर निगम विद्युत शाखा",
        "deptId": "gov-power",
        "keywords": [
            "लाइट", "स्ट्रीट लाइट", "अंधेरा", "बल्ब", "रोशनी", "खंभा", "सोलर",
            "light", "lights", "street light", "street_light", "streetlight", "dark", "lamp", "pole", "solar",
        ],
    },
    "health": {
        "hi": "स्वास्थ्य",
        "en": "Public Health",
        "dept": "स्वास्थ्य विभाग",
        "deptId": "gov-health",
        "keywords": [
            "स्वास्थ्य", "अस्पताल", "दवा", "डेंगू", "मच्छर", "बीमारी", "संक्रमण", "क्लीनिक",
            "health", "hospital", "clinic", "medicine", "dengue", "mosquito", "disease", "medical",
        ],
    },
    "electricity": {
        "hi": "बिजली",
        "en": "Electricity",
        "dept": "राजस्थान विद्युत वितरण निगम",
        "deptId": "gov-power",
        "keywords": [
            "बिजली", "ट्रांसफार्मर", "तार", "करंट", "कटौती", "मीटर", "वोल्टेज",
            "electricity", "power", "transformer", "wire", "outage", "blackout", "voltage",
        ],
    },
}

LOCALITY_COORDS: Dict[str, Tuple[float, float]] = {
    "वैशाली": (26.9124, 75.7873),
    "vaishali": (26.9124, 75.7873),
    "मानसरोवर": (26.8524, 75.7673),
    "mansarovar": (26.8524, 75.7673),
    "सांगानेर": (26.8190, 75.7980),
    "sanganer": (26.8190, 75.7980),
    "मालवीय": (26.8550, 75.8150),
    "malviya": (26.8550, 75.8150),
    "झोटवाड़ा": (26.9450, 75.7450),
    "jhotwara": (26.9450, 75.7450),
    "जयपुर": (26.9124, 75.7873),
    "jaipur": (26.9124, 75.7873),
    "दिल्ली": (28.6139, 77.2090),
    "delhi": (28.6139, 77.2090),
    "लखनऊ": (26.8467, 80.9462),
    "lucknow": (26.8467, 80.9462),
}

URGENCY_TERMS = [
    "खतरा", "गंभीर", "तुरंत", "आपात", "करंट", "दुर्घटना", "भारी", "बाधित", "बच्चों", "अस्पताल",
    "danger", "critical", "urgent", "emergency", "severe", "broken", "collapsed", "flooding", "shock",
]

KHORTHA_MARKERS = ["हमर", "रउआ", "नइखे", "भेल", "कतना", "काहे", "लगे", "दुनू"]


@dataclass
class NlpAnalysisResult:
    detected_language: str
    cleaned_text: str
    entities: Dict[str, Any]
    category_key: str
    category_hi: str
    category_en: str
    assigned_dept: str
    dept_id: str
    ai_confidence: int
    severity_score: int
    priority_hi: str
    priority_key: str
    lat: float
    lng: float


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return round(2 * r * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)


def detect_language(text: str, hint: Optional[str] = None) -> str:
    if hint in {"hi", "en", "khr"} and not text:
        return hint
    if any(marker in text for marker in KHORTHA_MARKERS):
        return "khr"
    devanagari_count = sum(1 for ch in text if "\u0900" <= ch <= "\u097F")
    latin_count = sum(1 for ch in text if "a" <= ch.lower() <= "z")
    if devanagari_count > latin_count:
        return "khr" if hint == "khr" else "hi"
    if latin_count > 0:
        return "en"
    return hint if hint in {"hi", "en", "khr"} else "hi"


def clean_text(text: str) -> str:
    normalized = re.sub(r"\s+", " ", (text or "").strip())
    return normalized


def extract_entities(text: str, location: str) -> Dict[str, Any]:
    combined = f"{text} {location}"
    ward_match = re.search(r"(?:ward|वार्ड)\s*[-:#]?\s*(\d+)", combined, re.IGNORECASE)
    matched_localities = [loc for loc in LOCALITY_COORDS if loc in combined.lower()]
    urgency_hits = [term for term in URGENCY_TERMS if term in combined.lower()]
    return {
        "ward": ward_match.group(1) if ward_match else None,
        "localities": matched_localities,
        "urgencySignals": urgency_hits,
    }


def infer_coordinates(location: str, lat: Optional[float], lng: Optional[float]) -> Tuple[float, float]:
    if lat is not None and lng is not None:
        return float(lat), float(lng)
    loc_lower = (location or "").lower()
    for key, coords in LOCALITY_COORDS.items():
        if key in loc_lower:
            return coords
    # Deterministic minor jitter around Jaipur centroid for distinct wards
    ward_match = re.search(r"(\d+)", location or "")
    offset = (int(ward_match.group(1)) % 20) * 0.004 if ward_match else 0.0
    return round(26.9000 + offset, 4), round(75.7800 + offset * 0.6, 4)


def _resolve_explicit_category(category: Optional[str]) -> Optional[str]:
    if not category:
        return None
    cat_lower = category.strip().lower()
    for key, meta in CATEGORY_DEFS.items():
        if cat_lower in {key, meta["hi"].lower(), meta["en"].lower()}:
            return key
    for key, meta in CATEGORY_DEFS.items():
        if any(kw in cat_lower for kw in meta["keywords"]):
            return key
    return None


def classify_category(title: str, description: str, explicit_category: Optional[str] = None) -> Tuple[str, int]:
    text_lower = f"{title} {description}".lower()
    scores: Dict[str, int] = {}
    for key, meta in CATEGORY_DEFS.items():
        scores[key] = sum(2 if kw in title.lower() else 1 for kw in meta["keywords"] if kw in text_lower)

    best_key = max(scores, key=lambda k: scores[k])
    best_score = scores[best_key]

    explicit_key = _resolve_explicit_category(explicit_category)
    if explicit_key and (best_score == 0 or explicit_key == best_key):
        best_key = explicit_key
    elif explicit_key and scores.get(explicit_key, 0) > 0:
        best_key = explicit_key

    confidence = min(96, 82 + best_score * 3) if best_score > 0 else 85
    return best_key, confidence


def compute_severity_and_priority(
    text: str,
    urgency_signals: List[str],
    affected_people: str = "",
    immediate_danger: str = "",
    duration: str = "",
    impact_level: str = "",
    has_photo: bool = False,
    has_video: bool = False,
    explicit_priority: Optional[str] = None,
) -> Tuple[int, str, str, int]:
    score = 42
    score += min(20, len(urgency_signals) * 7)

    if "100" in affected_people:
        score += 18
    elif "50" in affected_people:
        score += 14
    elif "10" in affected_people:
        score += 9
    elif "2" in affected_people:
        score += 4

    danger_lower = immediate_danger.lower()
    if danger_lower.startswith("हाँ") or danger_lower.startswith("yes"):
        score += 18

    impact_lower = impact_level.lower()
    if "बहुत अधिक" in impact_lower or "very high" in impact_lower:
        score += 14
    elif "अधिक" in impact_lower or "high" in impact_lower:
        score += 10
    elif "मध्यम" in impact_lower or "medium" in impact_lower:
        score += 5

    if "महीने" in duration or "month" in duration.lower() or "सप्ताह" in duration or "week" in duration.lower():
        score += 6

    conf_boost = (3 if has_photo else 0) + (2 if has_video else 0)
    score = max(15, min(99, score))

    # Map explicit priority if supplied by operator/citizen while keeping severity score realistic
    if explicit_priority:
        ep = explicit_priority.strip().lower()
        if ep in {"high", "उच्च"}:
            return max(score, 78), "उच्च", "high", conf_boost
        if ep in {"medium", "मध्यम"}:
            return min(max(score, 52), 74), "मध्यम", "medium", conf_boost
        if ep in {"low", "निम्न", "सामान्य"}:
            return min(score, 44), "निम्न", "low", conf_boost

    if score >= 70:
        return score, "उच्च", "high", conf_boost
    if score >= 48:
        return score, "मध्यम", "medium", conf_boost
    return score, "निम्न", "low", conf_boost


def _text_to_vector(text: str) -> Counter:
    cleaned = re.sub(r"[^\w\u0900-\u097F\s]", " ", (text or "").lower())
    words = [w for w in cleaned.split() if len(w) > 1]
    ngrams: List[str] = list(words)
    compact = " ".join(words)
    for i in range(max(0, len(compact) - 2)):
        gram = compact[i : i + 3]
        if gram.strip():
            ngrams.append(gram)
    return Counter(ngrams)


def text_similarity(text_a: str, text_b: str) -> float:
    va = _text_to_vector(text_a)
    vb = _text_to_vector(text_b)
    if not va or not vb:
        return 0.0
    vocab = list(set(va.keys()) | set(vb.keys()))
    vec_a = np.array([va.get(k, 0) for k in vocab], dtype=np.float64)
    vec_b = np.array([vb.get(k, 0) for k in vocab], dtype=np.float64)
    denom = float(np.linalg.norm(vec_a) * np.linalg.norm(vec_b))
    if denom == 0.0:
        return 0.0
    return round(float(np.dot(vec_a, vec_b) / denom), 4)


def find_duplicate_issue(
    candidate_title: str,
    candidate_desc: str,
    category_key: str,
    lat: float,
    lng: float,
    existing_issues: List[Dict[str, Any]],
    threshold: float = 0.56,
) -> Optional[Tuple[str, float]]:
    candidate_text = f"{candidate_title} {candidate_desc}"
    best_id: Optional[str] = None
    best_sim = 0.0

    for issue in existing_issues:
        if issue.get("duplicate_of"):
            continue
        if issue.get("category_key") != category_key:
            continue
        dist_km = haversine_km(lat, lng, float(issue.get("lat", lat)), float(issue.get("lng", lng)))
        if dist_km > 6.0:
            continue
        existing_text = f"{issue.get('title', '')} {issue.get('description', '')}"
        sim = text_similarity(candidate_text, existing_text)
        # Boost slightly if very close geographically (< 1 km)
        if dist_km <= 1.0:
            sim = min(1.0, sim + 0.08)
        if sim >= threshold and sim > best_sim:
            best_sim = sim
            best_id = issue["id"]

    if best_id:
        return best_id, round(best_sim, 3)
    return None


def run_nlp_pipeline(payload: Dict[str, Any]) -> NlpAnalysisResult:
    title = clean_text(payload.get("title", ""))
    description = clean_text(payload.get("description", ""))
    location = clean_text(payload.get("location", ""))
    combined = f"{title} {description}"

    detected_lang = detect_language(combined, payload.get("language"))
    entities = extract_entities(combined, location)
    lat, lng = infer_coordinates(location, payload.get("lat"), payload.get("lng"))
    category_key, base_conf = classify_category(title, description, payload.get("category"))
    cat_meta = CATEGORY_DEFS[category_key]

    has_photo = bool(payload.get("photoEvidence"))
    has_video = bool(payload.get("videoEvidence"))

    severity_score, priority_hi, priority_key, conf_boost = compute_severity_and_priority(
        text=combined,
        urgency_signals=entities["urgencySignals"],
        affected_people=payload.get("affectedPeople", ""),
        immediate_danger=payload.get("immediateDanger", ""),
        duration=payload.get("duration", ""),
        impact_level=payload.get("impactLevel", ""),
        has_photo=has_photo,
        has_video=has_video,
        explicit_priority=payload.get("priority"),
    )

    ai_confidence = payload.get("aiConfidence") or min(96, base_conf + conf_boost)

    return NlpAnalysisResult(
        detected_language=detected_lang,
        cleaned_text=combined,
        entities=entities,
        category_key=category_key,
        category_hi=cat_meta["hi"],
        category_en=cat_meta["en"],
        assigned_dept=cat_meta["dept"],
        dept_id=cat_meta["deptId"],
        ai_confidence=int(ai_confidence),
        severity_score=severity_score,
        priority_hi=priority_hi,
        priority_key=priority_key,
        lat=lat,
        lng=lng,
    )
