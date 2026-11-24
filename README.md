# SANKALP-Setu (संकल्प-सेतु)

> **Smart India Hackathon 2026 (SIH 2026)**  
> **Problem Statement ID:** SIH26043  
> **Problem Statement Title:** A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships  
> **Theme:** Smart Education | **Category:** Software | **Team Name:** SANKALP  

---

## 📌 Executive Overview

**SANKALP-Setu** is an AI-powered civic-academic-industry collaboration platform. It bridges citizens, government departments, university Institution's Innovation Councils (IIC), and industry CSR foundations to solve real ground-level societal challenges transparently.

Citizens report grievances via multi-modal channels (Text, Photos, Videos, Geo-tagging, Toll-Free IVR, and CSC/Panchayat centres). The platform applies AI/NLP to classify the issue, score its severity, flag duplicates, and automatically match it to:
1. **Government Department** for official mandate, validation, and ground execution.
2. **University Innovation Cell (IIC)** for student/faculty R&D and low-cost prototyping.
3. **Industry / CSR Partner** for transparent co-funding and resource allocation under MCA guidelines.

---

## 🏗️ Project Architecture

```
Sankalp-Setu/
├── backend/                             # Python FastAPI Backend API
│   ├── app/
│   │   ├── main.py                      # Application factory, lifespan, CORS, static routes
│   │   ├── config.py                    # Environment settings
│   │   ├── db.py                        # SQLite WAL database & schema migrations
│   │   ├── schemas.py                   # Pydantic validation models
│   │   ├── services/
│   │   │   ├── ai_engine.py             # NLP classification, severity scoring, deduplication
│   │   │   ├── routing_engine.py        # Multi-stakeholder matching & 5-factor explainability
│   │   │   ├── privacy.py               # DPDP Act 2023 phone masking & Argon2 auth
│   │   │   └── events.py                # Kafka-compatible event log & priority alerts
│   │   └── routers/
│   │       ├── issues.py                # Citizen intake, webhooks, IVR, validation, lifecycle
│   │       ├── university.py            # IIC R&D challenges & proposal submissions
│   │       ├── csr.py                   # CSR co-funding, 80G receipts, CIN/GST verification
│   │       └── admin.py                 # Command center auth, KPIs & audit logs
│   ├── tests/
│   │   └── test_api.py                  # Test suite
│   ├── requirements.txt                 # Backend dependencies
│   └── README.md                        # Backend documentation
│
├── frontend/                            # React 18 + Tailwind CSS + Vite
│   ├── src/
│   │   ├── api/client.js                # API client connecting to FastAPI backend
│   │   ├── context/EcosystemContext.jsx # State management with live backend sync
│   │   ├── pages/                       # Citizen, Government, University, CSR, Admin dashboards
│   │   └── components/                  # Modals, maps, visual workflow steppers
│   ├── package.json
│   └── vite.config.js                   # Proxy configuration for /api and /uploads
│
├── .gitignore                           # Excludes build artifacts, databases, node_modules
└── README.md                            # Main project overview
```

---

## ⚡ Key Technical Features (From SIH Deck)

1. **Multi-Modal Intake**:
   - Web application, live webhook (`POST /api/v1/complaints/webhook`), toll-free IVR helpline (`1800-185-2026`), and CSC/Panchayat facilitator access.
   - Base64 photo and video evidence upload pipeline.

2. **AI / ML / NLP Processing Engine**:
   - Language identification (`hi` Hindi, `en` English, `khr` Khortha).
   - Domain classification across 6 civic domains (`जल आपूर्ति`, `सड़क`, `कचरा`, `स्ट्रीट लाइट`, `स्वास्थ्य`, `बिजली`).
   - Priority and severity scoring (`0–100` -> `high` / `medium` / `low`).
   - Vector cosine similarity + Haversine geo-clustering for instant duplicate flagging and merging.

3. **Multi-Stakeholder Smart Routing & Explainability**:
   - Automated routing to matched Govt Dept + University IIC + CSR Partner.
   - 5-factor explainability breakdown (Domain Mandate, Geographic Proximity, Technical Capability, Funding Alignment, Historical Success).
   - Priority-tiered dispatching:
     - **High Priority**: Immediate multi-stakeholder alerts (SMS/Email/Push).
     - **Medium Priority**: Fast-track joint solution queue.
     - **Low Priority**: Standard institutional research queue for university IIC uptake.

4. **6-Stage Visual Timeline Stepper**:
   - `दर्ज (Registered)` ➔ `AI विश्लेषण (AI Analysis)` ➔ `सत्यापन (Validation)` ➔ `सही संस्था (Routed)` ➔ `समाधान (Resolution)` ➔ `प्रभाव (Impact Verification)`.

5. **DPDP Act 2023 Compliance**:
   - Automatic citizen phone number masking (`98765*****`).
   - Salted HMAC-SHA256 digests for internal identity tracking without exposing PII.

6. **Industry / CSR Co-Funding & Compliance**:
   - Automated 80G tax compliance certificate reference generator (`80G-MCA-YYYYMM-XXXXXX`).
   - CIN / GSTIN / MCA CSR-1 registration verification.

---

## 🚀 Getting Started

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* **API Documentation (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Health Endpoint:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* **Frontend Portal:** [http://localhost:3000](http://localhost:3000)

### 3. Demo Admin Credentials
* **Officer ID:** `admin@sankalp.gov.in` (or `ADMIN2026`)
* **Password:** `sankalp2026`

---

## 🧪 Testing

To execute the backend verification tests:
```bash
cd backend
python -m unittest discover -s tests -v
```
