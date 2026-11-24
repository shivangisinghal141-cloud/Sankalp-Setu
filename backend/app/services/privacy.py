from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import time
from typing import Any, Dict, Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.config import settings

_password_hasher = PasswordHasher()


def mask_phone(phone: Optional[str]) -> str:
    """Mask phone number under DPDP Act 2023 data-minimization rules."""
    if not phone:
        return ""
    raw = str(phone).strip()
    if "*" in raw:
        return raw
    digits = re.sub(r"\D", "", raw)
    if len(digits) <= 4:
        return "*" * len(digits)
    if len(digits) >= 10:
        local = digits[-10:]
        return f"{local[:5]}*****"
    visible = max(2, len(digits) // 2)
    return f"{digits[:visible]}{'*' * (len(digits) - visible)}"


def hash_phone(phone: Optional[str]) -> str:
    """Return a salted HMAC-SHA256 digest of a phone number for internal matching."""
    if not phone:
        return ""
    digits = re.sub(r"\D", "", str(phone))
    if not digits:
        return ""
    return hmac.new(
        settings.dpdp_salt.encode("utf-8"),
        digits.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def hash_password(password: str) -> str:
    return _password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return _password_hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(subject: str, role: str = "admin", ttl_seconds: Optional[int] = None) -> str:
    ttl = ttl_seconds or settings.token_ttl_seconds
    now = int(time.time())
    payload = {
        "sub": subject,
        "role": role,
        "iat": now,
        "exp": now + ttl,
    }
    header_b64 = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    sig = hmac.new(
        settings.secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    return f"{header_b64}.{payload_b64}.{_b64url_encode(sig)}"


def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = hmac.new(
            settings.secret_key.encode("utf-8"),
            signing_input,
            hashlib.sha256,
        ).digest()
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return payload
    except Exception:
        return None
