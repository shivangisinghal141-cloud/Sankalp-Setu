from __future__ import annotations

import base64
import sys
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.config import settings
from app.db import init_db
from app.main import create_app


class SankalpBackendTestSuite(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        temp_path = Path(self.temp_dir.name)
        object.__setattr__(settings, "db_path", temp_path / "test_sankalp.db")
        object.__setattr__(settings, "upload_dir", temp_path / "uploads")
        init_db(settings.db_path)
        self.app = create_app()
        self.client = TestClient(self.app)

    def tearDown(self) -> None:
        self.client.close()
        self.temp_dir.cleanup()

    def test_health_and_seeded_issues(self) -> None:
        health = self.client.get("/api/v1/health")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json()["status"], "ok")

        issues = self.client.get("/api/v1/issues")
        self.assertEqual(issues.status_code, 200)
        data = issues.json()
        self.assertGreaterEqual(len(data), 4)
        ids = {item["id"] for item in data}
        self.assertIn("SNK-2026-0012", ids)

    def test_track_issue_by_id_and_keyword(self) -> None:
        by_id = self.client.get("/api/v1/issues/track/SNK-2026-0012")
        self.assertEqual(by_id.status_code, 200)
        self.assertEqual(by_id.json()["categoryKey"], "water")

        by_kw = self.client.get("/api/v1/issues/track/Vaishali")
        self.assertIn(by_kw.status_code, (200, 404))
        by_hi = self.client.get("/api/v1/issues/track/वैशाली")
        self.assertEqual(by_hi.status_code, 200)
        self.assertEqual(by_hi.json()["id"], "SNK-2026-0012")

    def test_webhook_nlp_classification_dpdp_masking_and_high_priority_alert(self) -> None:
        payload = {
            "title": "Main water pipeline burst causing severe flooding",
            "description": "Drinking water pipeline broken near Ward 26 Vaishali Nagar Jaipur causing danger and contamination for 150 residents.",
            "location": "Ward 26, Vaishali Nagar, Jaipur",
            "citizenName": "Rohan Mehta",
            "citizenPhone": "9876543210",
            "affectedPeople": "100 से अधिक",
            "immediateDanger": "हाँ, गंभीर खतरा",
            "impactLevel": "बहुत अधिक",
            "duration": "4–7 दिन",
            "language": "en",
        }
        res = self.client.post("/api/v1/complaints/webhook", json=payload)
        self.assertEqual(res.status_code, 201)
        body = res.json()

        self.assertEqual(body["categoryKey"], "water")
        self.assertEqual(body["priorityKey"], "high")
        self.assertEqual(body["routingTier"], "immediate_multi_stakeholder_alert")
        # DPDP Act 2023 masking
        self.assertEqual(body["citizenPhone"], "98765*****")
        self.assertIn("government", body["matchedStakeholders"])
        self.assertIn("university", body["matchedStakeholders"])
        self.assertIn("csr", body["matchedStakeholders"])
        self.assertEqual(len(body["timeline"]), 6)

        # Reasoning endpoint for AiReasoningModal
        reasoning = self.client.get(f"/api/v1/issues/{body['id']}/reasoning")
        self.assertEqual(reasoning.status_code, 200)
        self.assertEqual(len(reasoning.json()["factors"]), 5)

        # Verify event log captured complaint & alert
        events = self.client.get("/api/v1/events").json()
        event_types = {e["eventType"] for e in events}
        self.assertIn("complaint.submitted", event_types)
        self.assertIn("alert.multi_stakeholder_dispatched", event_types)

    def test_duplicate_detection_merges_cluster_count(self) -> None:
        dup_payload = {
            "title": "जल आपूर्ति समस्या एवं पाइपलाइन रिसाव",
            "description": "पिछले 4 दिनों से पेयजल आपूर्ति बाधित है तथा मुख्य पाइपलाइन में भारी रिसाव हो रहा है।",
            "location": "वार्ड 26, वैशाली, जयपुर",
            "citizenName": "कविता सिंह",
            "citizenPhone": "9988776655",
        }
        res = self.client.post("/api/v1/issues", json=dup_payload)
        self.assertEqual(res.status_code, 201)
        created = res.json()
        self.assertEqual(created["duplicateOf"], "SNK-2026-0012")

        parent = self.client.get("/api/v1/issues/SNK-2026-0012").json()
        self.assertEqual(parent["duplicateCount"], 8)

    def test_ivr_and_evidence_and_lifecycle_actions(self) -> None:
        ivr_res = self.client.post(
            "/api/v1/issues/ivr",
            json={
                "callerPhone": "9123456789",
                "transcript": "वार्ड 12 सांगानेर में स्ट्रीट लाइट बंद है अंधेरा है",
                "language": "hi",
                "district": "जयपुर",
                "wardOrPanchayat": "वार्ड 12 सांगानेर",
                "channel": "ivr_helpline",
            },
        )
        self.assertEqual(ivr_res.status_code, 201)
        ivr_issue = ivr_res.json()
        self.assertEqual(ivr_issue["intakeChannel"], "ivr_helpline")
        self.assertEqual(ivr_issue["citizenPhone"], "91234*****")
        self.assertEqual(ivr_issue["categoryKey"], "lights")

        # Validate & advance stage
        val_res = self.client.post(
            f"/api/v1/issues/{ivr_issue['id']}/validate",
            json={"approved": True, "officerId": "NODAL-JDA-02", "notes": "Field verified"},
        )
        self.assertEqual(val_res.status_code, 200)
        self.assertEqual(val_res.json()["statusKey"], "verified")

        act_res = self.client.post(
            f"/api/v1/issues/{ivr_issue['id']}/action",
            json={"officerId": "NODAL-JDA-02", "stage": "resolved", "remarks": "12 LED poles replaced"},
        )
        self.assertEqual(act_res.status_code, 200)
        self.assertEqual(act_res.json()["statusKey"], "resolved")
        self.assertTrue(act_res.json()["timeline"][4]["completed"])

        # Evidence upload
        sample_b64 = base64.b64encode(b"fake-png-bytes").decode("ascii")
        ev_res = self.client.post(
            "/api/v1/issues/evidence",
            json={"filename": "site_photo.png", "contentType": "image/png", "dataBase64": sample_b64},
        )
        self.assertEqual(ev_res.status_code, 201)
        self.assertTrue(ev_res.json()["url"].startswith("/uploads/"))

    def test_university_and_csr_and_collaboration_endpoints(self) -> None:
        prop_res = self.client.post(
            "/api/v1/university/proposals",
            json={
                "challengeId": "CHAL-2026-01",
                "projectTitle": "Acoustic IoT Leak Detector Mesh",
                "university": "MNIT Jaipur (IIC Cell)",
                "studentTeam": "Team Sankalp IoT",
                "methodology": "ESP32 + hydrophone anomaly detection",
            },
        )
        self.assertEqual(prop_res.status_code, 201)
        prj_id = prop_res.json()["id"]

        prog_res = self.client.patch(
            f"/api/v1/university/projects/{prj_id}/progress",
            json={"progress": 65, "milestoneNote": "Lab prototype calibrated"},
        )
        self.assertEqual(prog_res.status_code, 200)
        self.assertEqual(prog_res.json()["progress"], 65)

        pledge_res = self.client.post(
            "/api/v1/csr/pledges",
            json={
                "opportunityId": "CSR-OPP-201",
                "partnerName": "TATA CSR Foundation",
                "amountInr": 300000,
                "cinOrGst": "L99999MH1995PLC089100",
            },
        )
        self.assertEqual(pledge_res.status_code, 201)
        self.assertEqual(pledge_res.json()["opportunity"]["statusKey"], "fulfilled")
        self.assertTrue(pledge_res.json()["pledge"]["complianceCertificateId"].startswith("80G-MCA-"))

        verify_bad = self.client.post(
            "/api/v1/csr/partners/verify",
            json={"organizationName": "Fake Org", "cin": "INVALID"},
        )
        self.assertEqual(verify_bad.status_code, 200)
        self.assertFalse(verify_bad.json()["verified"])

        verify_ok = self.client.post(
            "/api/v1/csr/partners/verify",
            json={"organizationName": "Infosys Foundation", "csrRegistrationNo": "CSR00004123"},
        )
        self.assertEqual(verify_ok.status_code, 200)
        self.assertTrue(verify_ok.json()["verified"])

        # Collaboration workspace milestone
        mil_res = self.client.post(
            "/api/v1/collaboration/SNK-2026-0012/milestones",
            json={
                "phase": "Impact Verification",
                "ownerType": "csr",
                "ownerName": "TATA Trust Clean Water CSR",
                "summary": "48-hour clean water pressure audit passed",
                "completed": True,
            },
        )
        self.assertEqual(mil_res.status_code, 201)

    def test_admin_auth_and_analytics_stats(self) -> None:
        bad_login = self.client.post(
            "/api/v1/admin/login", json={"username": "admin@sankalp.gov.in", "password": "wrong"}
        )
        self.assertEqual(bad_login.status_code, 401)

        ok_login = self.client.post(
            "/api/v1/admin/login", json={"username": "admin@sankalp.gov.in", "password": "sankalp2026"}
        )
        self.assertEqual(ok_login.status_code, 200)
        token = ok_login.json()["accessToken"]

        me = self.client.get("/api/v1/admin/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.json()["officerId"], "admin@sankalp.gov.in")

        # Protected stakeholder creation
        unauth_stk = self.client.post(
            "/api/v1/stakeholders",
            json={
                "name": "IIT Jodhpur IIC",
                "stakeholderType": "university",
                "categories": ["water"],
                "location": "Jodhpur",
            },
        )
        self.assertEqual(unauth_stk.status_code, 401)

        auth_stk = self.client.post(
            "/api/v1/stakeholders",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": "IIT Jodhpur IIC",
                "stakeholderType": "university",
                "categories": ["water"],
                "location": "Jodhpur",
            },
        )
        self.assertEqual(auth_stk.status_code, 201)

        stats = self.client.get("/api/v1/analytics/stats")
        self.assertEqual(stats.status_code, 200)
        self.assertTrue(stats.json()["dpdpCompliance"]["phoneMaskingActive"])


if __name__ == "__main__":
    unittest.main()
