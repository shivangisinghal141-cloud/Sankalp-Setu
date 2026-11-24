from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db import init_db
from app.routers import admin, csr, issues, university


@asynccontextmanager
async def lifespan(_app: FastAPI):
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "SIH 2026 (SIH26043) SANKALP-Setu Backend API: Multi-modal citizen intake, "
            "AI/NLP classification, severity scoring & deduplication, smart routing across "
            "Government + University IIC + Industry/CSR, DPDP Act 2023 privacy, and live tracking."
        ),
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(settings.upload_dir)), name="uploads")

    app.include_router(issues.router)
    app.include_router(university.router)
    app.include_router(csr.router)
    app.include_router(admin.router)

    @app.get("/health", tags=["Health"])
    @app.get("/api/v1/health", tags=["Health"])
    def health_check() -> Dict[str, str]:
        return {
            "status": "ok",
            "service": settings.app_name,
            "version": settings.app_version,
            "env": settings.env,
        }

    return app


app = create_app()
