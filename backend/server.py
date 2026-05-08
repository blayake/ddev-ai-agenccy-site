from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
import logging
import os
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR: Path = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger: logging.Logger = logging.getLogger(__name__)

mongo_url: str = os.environ["MONGO_URL"]
client: AsyncIOMotorClient = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app: FastAPI = FastAPI(title="Blayake API")
api_router: APIRouter = APIRouter(prefix="/api")


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=120)
    project_type: Optional[str] = Field(default=None, max_length=80)
    message: Optional[str] = Field(default=None, max_length=2000)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    project_type: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def _serialize_datetime(doc: dict, key: str) -> dict:
    """Serialise a datetime field in a Mongo document to ISO-8601 string."""
    value = doc.get(key)
    if isinstance(value, datetime):
        doc[key] = value.isoformat()
    return doc


def _deserialize_datetime(doc: dict, key: str) -> dict:
    """Convert an ISO-8601 string back to a datetime (idempotent)."""
    value = doc.get(key)
    if isinstance(value, str):
        doc[key] = datetime.fromisoformat(value)
    return doc


# ---------- Routes ----------
@api_router.get("/")
async def root() -> dict:
    return {"message": "Blayake API up", "service": "blayake"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate) -> StatusCheck:
    obj: StatusCheck = StatusCheck(**payload.model_dump())
    doc: dict = obj.model_dump()
    _serialize_datetime(doc, "timestamp")
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    rows: List[dict] = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        _deserialize_datetime(r, "timestamp")
    return rows


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate) -> Lead:
    obj: Lead = Lead(**payload.model_dump())
    doc: dict = obj.model_dump()
    _serialize_datetime(doc, "created_at")
    try:
        await db.leads.insert_one(doc)
    except Exception as exc:
        logger.exception("Failed to insert lead")
        raise HTTPException(status_code=500, detail="Could not save lead") from exc
    return obj


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 100) -> List[Lead]:
    rows: List[dict] = (
        await db.leads.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    for r in rows:
        _deserialize_datetime(r, "created_at")
    return rows


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
