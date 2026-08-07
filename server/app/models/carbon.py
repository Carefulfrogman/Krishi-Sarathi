"""Carbon credit, transaction, and marketplace ORM models and Pydantic schemas."""

import uuid
from datetime import datetime, date
from typing import Optional

from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel

from app.database.connection import Base


class CarbonCredit(Base):
    __tablename__ = "carbon_credits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    credits_amount = Column(Float, nullable=False, default=0)
    credits_available = Column(Float, nullable=False, default=0)
    verification_status = Column(String(20), default="pending")
    verified_at = Column(DateTime(timezone=True))
    period_start = Column(Date)
    period_end = Column(Date)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    credit_id = Column(UUID(as_uuid=True), ForeignKey("carbon_credits.id"), nullable=False)
    amount = Column(Float, nullable=False)
    price_per_credit = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    transaction_date = Column(DateTime(timezone=True), default=datetime.utcnow)


class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    credit_id = Column(UUID(as_uuid=True), ForeignKey("carbon_credits.id"), nullable=False)
    amount = Column(Float, nullable=False)
    price_per_credit = Column(Float, nullable=False)
    min_purchase = Column(Float, default=1)
    description = Column(String)
    status = Column(String(20), default="active")
    listed_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at = Column(DateTime(timezone=True))


# --- Pydantic Schemas ---

class CarbonCreditResponse(BaseModel):
    id: str
    farm_id: str
    user_id: str
    credits_amount: float
    credits_available: float
    verification_status: str
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionResponse(BaseModel):
    id: str
    seller_id: str
    buyer_id: Optional[str] = None
    credit_id: str
    amount: float
    price_per_credit: float
    total_price: float
    status: str
    transaction_date: datetime

    model_config = {"from_attributes": True}


class ListingCreate(BaseModel):
    credit_id: str
    amount: float
    price_per_credit: float
    min_purchase: float = 1
    description: Optional[str] = None


class ListingResponse(BaseModel):
    id: str
    seller_id: str
    credit_id: str
    amount: float
    price_per_credit: float
    min_purchase: float
    description: Optional[str] = None
    status: str
    listed_at: datetime

    model_config = {"from_attributes": True}


class PurchaseRequest(BaseModel):
    listing_id: str
    amount: float
