"""Backend tests for Blayake API: health + leads CRUD validation (updated schema with phone)."""
import os
import pytest
import requests
from pathlib import Path

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    env_p = Path('/app/frontend/.env')
    if env_p.exists():
        for line in env_p.read_text().splitlines():
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "blayake"
        assert "message" in data


# ---------- Leads (new schema with optional phone & message) ----------
class TestLeads:
    def test_create_lead_with_phone_and_message(self, client):
        payload = {
            "name": "TEST_Alice",
            "email": "TEST_alice@example.com",
            "phone": "+1 (415) 555-9090",
            "message": "Need an AI workflow built for ops.",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        assert data["phone"] == payload["phone"]
        assert data["message"] == payload["message"]
        assert "_id" not in data

    def test_create_lead_required_only(self, client):
        # Only name + email — phone and message optional
        payload = {"name": "TEST_Bob", "email": "TEST_bob@example.com"}
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == "TEST_Bob"
        assert data["email"] == "TEST_bob@example.com"
        assert data.get("phone") is None
        assert data.get("message") is None
        assert "_id" not in data

    def test_create_lead_invalid_email(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_Bob", "email": "notanemail",
        }, timeout=15)
        assert r.status_code == 422

    def test_create_lead_missing_name(self, client):
        r = client.post(f"{API}/leads", json={
            "email": "x@y.com",
        }, timeout=15)
        assert r.status_code == 422

    def test_create_lead_missing_email(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_NoEmail",
        }, timeout=15)
        assert r.status_code == 422

    def test_list_leads_persistence_no_objectid_sorted_desc_includes_phone(self, client):
        # Create another lead with phone so we have >=2 with phone present
        client.post(f"{API}/leads", json={
            "name": "TEST_Eve", "email": "TEST_eve@example.com",
            "phone": "+44 20 7946 0000",
            "message": "Second lead for ordering test.",
        }, timeout=15)

        r = client.get(f"{API}/leads", timeout=15)
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list)
        assert len(leads) >= 2
        for lead in leads:
            assert "_id" not in lead
            assert "id" in lead and "created_at" in lead
            # phone field should be present on every lead (may be None)
            assert "phone" in lead

        # Sorted desc by created_at
        ts = [lead["created_at"] for lead in leads]
        assert ts == sorted(ts, reverse=True)

        # Verify at least one TEST_Eve has phone saved
        eve = next((lead for lead in leads if lead.get("email") == "TEST_eve@example.com"), None)
        assert eve is not None
        assert eve["phone"] == "+44 20 7946 0000"
