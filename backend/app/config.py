from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List


BASE_DIR = Path(__file__).resolve().parent.parent


@dataclass(frozen=True)
class Settings:
    app_name: str = "SANKALP-Setu Backend API"
    app_version: str = "1.0.0"
    env: str = os.getenv("SANKALP_ENV", "development")
    host: str = os.getenv("SANKALP_HOST", "127.0.0.1")
    port: int = int(os.getenv("SANKALP_PORT", "8000"))
    db_path: Path = Path(
        os.getenv("SANKALP_DB_PATH", str(BASE_DIR / "data" / "sankalp.db"))
    )
    upload_dir: Path = Path(
        os.getenv("SANKALP_UPLOAD_DIR", str(BASE_DIR / "uploads"))
    )
    secret_key: str = os.getenv("SANKALP_SECRET_KEY", "sankalp-dev-secret-key-2026")
    dpdp_salt: str = os.getenv("SANKALP_DPDP_SALT", "sankalp-dpdp-2023-salt")
    cors_origins: List[str] = field(
        default_factory=lambda: [
            origin.strip()
            for origin in os.getenv(
                "SANKALP_CORS_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173",
            ).split(",")
            if origin.strip()
        ]
    )
    token_ttl_seconds: int = int(os.getenv("SANKALP_TOKEN_TTL_SECONDS", "86400"))
    kafka_enabled: bool = os.getenv("SANKALP_KAFKA_ENABLED", "false").lower() == "true"
    kafka_bootstrap_servers: str = os.getenv(
        "SANKALP_KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"
    )


settings = Settings()
