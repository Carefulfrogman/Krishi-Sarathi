"""Insurance policy and claim ORM models and Pydantic schemas."""

import uuid
from datetime import datetime, date
from typing import Optional, List

from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel

from app.database.connection import Base


class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    policy_number = Column(String(50), unique=True, nullable=False)
    provider = Column(String(255))
    coverage_type = Column(String(100))
    coverage_amount = Column(Float)
    premium = Column(Float)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


class InsuranceClaim(Base):
    __tablename__ = "insurance_claims"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("insurance_policies.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    claim_type = Column(String(100), nullable=False)
    description = Column(Text)
    damage_amount = Column(Float)
    claimed_amount = Column(Float)
    approved_amount = Column(Float)
    evidence_urls = Column(ARRAY(Text))
    ai_verification_score = Column(Float)
    status = Column(String(20), default="submitted")
    submitted_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    resolved_at = Column(DateTime(timezone=True))


class DisasterReport(Base):
    __tablename__ = "disaster_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"))
    disaster_type = Column(String(100), nullable=False)
    severity = Column(String(20), default="moderate")
    description = Column(Text)
    location = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    image_urls = Column(ARRAY(Text))
    ai_severity_score = Column(Float)
    verified = Column(String, default="false")
    reported_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# --- Pydantic Schemas ---

class PolicyResponse(BaseModel):
    id: str
    user_id: str
    farm_id: str
    policy_number: str
    provider: Optional[str] = None
    coverage_type: Optional[str] = None
    coverage_amount: Optional[float] = None
    premium: Optional[float] = None
    start_date: date
    end_date: date
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ClaimCreate(BaseModel):
    policy_id: str
    claim_type: str
    description: Optional[str] = None
    damage_amount: Optional[float] = None
    claimed_amount: Optional[float] = None
    evidence_urls: Optional[List[str]] = None


class ClaimResponse(BaseModel):
    id: str
    policy_id: str
    user_id: str
    claim_type: str
    description: Optional[str] = None
    damage_amount: Optional[float] = None
    claimed_amount: Optional[float] = None
    approved_amount: Optional[float] = None
    ai_verification_score: Optional[float] = None
    status: str
    submitted_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DisasterReportCreate(BaseModel):
    farm_id: Optional[str] = None
    disaster_type: str
    severity: str = "moderate"
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_urls: Optional[List[str]] = None


class DisasterReportResponse(BaseModel):
    id: str
    user_id: str
    farm_id: Optional[str] = None
    disaster_type: str
    severity: str
    description: Optional[str] = None
    location: Optional[str] = None
    ai_severity_score: Optional[float] = None
    verified: Optional[str] = None
    reported_at: datetime

    model_config = {"from_attributes": True}
