"""Supply chain event ORM model and Pydantic schemas."""

import uuid
from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pydantic import BaseModel

from app.database.connection import Base


class SupplyChainEvent(Base):
    __tablename__ = "supply_chain_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    crop_id = Column(UUID(as_uuid=True), ForeignKey("crops.id"))
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    description = Column(Text)
    location = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    actor_name = Column(String(255))
    event_metadata = Column("metadata", JSONB, default={})
    qr_code = Column(String(255))
    event_date = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# --- Pydantic Schemas ---

class SupplyChainEventCreate(BaseModel):
    crop_id: Optional[str] = None
    farm_id: str
    event_type: str
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    actor_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class SupplyChainEventResponse(BaseModel):
    id: str
    crop_id: Optional[str] = None
    farm_id: str
    event_type: str
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    actor_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    qr_code: Optional[str] = None
    event_date: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
