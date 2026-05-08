"""Backend tests for Blayake API: health + leads CRUD validation."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # fallback to frontend/.env
    from pathlib import Path
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


# ---------- Leads ----------
class TestLeads:
    def test_create_lead_valid(self, client):
        payload = {
            "name": "TEST_Alice",
            "email": "TEST_alice@example.com",
            "company": "Acme",
            "project_type": "automation",
            "message": "Need an AI workflow built for ops.",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        assert data["message"] == payload["message"]
        assert "_id" not in data

    def test_create_lead_invalid_email(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_Bob", "email": "notanemail",
            "message": "hello there",
        }, timeout=15)
        assert r.status_code == 422

    def test_create_lead_missing_name(self, client):
        r = client.post(f"{API}/leads", json={
            "email": "x@y.com", "message": "hello there",
        }, timeout=15)
        assert r.status_code == 422

    def test_create_lead_missing_message(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_C", "email": "x@y.com",
        }, timeout=15)
        assert r.status_code == 422

    def test_create_lead_short_message(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_D", "email": "d@y.com", "message": "hi",
        }, timeout=15)
        assert r.status_code == 422

    def test_list_leads_persistence_and_no_objectid(self, client):
        # Create another lead so we have >=2
        client.post(f"{API}/leads", json={
            "name": "TEST_Eve", "email": "TEST_eve@example.com",
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

        # Sorted desc by created_at
        ts = [lead["created_at"] for lead in leads]
        assert ts == sorted(ts, reverse=True)
