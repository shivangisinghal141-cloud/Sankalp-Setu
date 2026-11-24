# SANKALP-Setu Backend (SIH 2026 — SIH26043)

FastAPI backend implementing the **SANKALP** digital platform architecture for crowdsourcing societal challenges and routing them across **Government Departments + HEI Innovation Cells (IIC) + Industry / CSR Partners**.

## Architecture Mapping (from SIH 2026 Deck)

1. **Multi-Modal Intake (`POST /api/v1/issues`, `/api/v1/complaints/webhook`, `/api/v1/issues/ivr`, `/api/v1/issues/evidence`)**:
   - Web app, live complaint webhook (`/api/v1/complaints/webhook`), toll-free IVR (`1800-185-2026`), and CSC / Panchayat facilitator intake.
   - Photo/video evidence attachment storage (`/uploads/...`).
2. **AI / ML / NLP Engine (`app/services/ai_engine.py`)**:
   - Language detection (`hi`, `en`, `khr`), text normalization, ward/locality/urgency entity extraction.
   - Domain classification across 6 civic categories (`water`, `roads`, `waste`, `lights`, `health`, `electricity`).
   - Severity scoring (`0-100` -> `high` / `medium` / `low`) and cosine-similarity + Haversine geo-proximity deduplication.
3. **Human-in-the-Loop Validation (`POST /api/v1/issues/{id}/validate`) & Lifecycle (`POST /api/v1/issues/{id}/action`)**:
   - 6-stage timeline stepper (`दर्ज` -> `AI विश्लेषण` -> `सत्यापन` -> `सही संस्था` -> `समाधान` -> `प्रभाव`).
4. **Stakeholder Matching & Smart Routing Engine (`app/services/routing_engine.py`)**:
   - Matches Government Nodal Dept + HEI IIC Cell + Verified CSR Partner with 5-factor explainability (`GET /api/v1/issues/{id}/reasoning`).
   - Priority routing tiers:
     - `high` -> `immediate_multi_stakeholder_alert`
     - `medium` -> `joint_hei_csr_fast_track`
     - `low` -> `hei_research_queue`
5. **Collaboration Workspaces (`app/routers/university.py`, `app/routers/csr.py`, `/api/v1/collaboration/{id}`)**:
   - University IIC R&D proposals & milestone progress tracking.
   - CSR co-funding pledges with 80G reference generation & CIN/GSTIN/MCA CSR-1 partner verification.
6. **DPDP Act 2023 & Admin Security (`app/services/privacy.py`, `app/routers/admin.py`)**:
   - Automatic phone masking (`98765*****`) + salted HMAC-SHA256 hashing.
   - Argon2 password hashing & signed HMAC-SHA256 bearer tokens (`admin@sankalp.gov.in` / `sankalp2026`).

## Run Locally

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Interactive OpenAPI docs: `http://127.0.0.1:8000/docs`

## Run Tests

```bash
cd backend
python -m unittest discover -s tests -v
```
