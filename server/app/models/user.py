"""User ORM model and Pydantic schemas."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String(128), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    display_name = Column(String(255))
    photo_url = Column(String)
    phone = Column(String(20))
    role = Column(String(20), default="farmer")
    reward_points = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    rewards = relationship("Reward", back_populates="user", cascade="all, delete-orphan")


# --- Pydantic Schemas ---

class UserCreate(BaseModel):
    firebase_uid: str
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    role: str = "farmer"


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    firebase_uid: str
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    role: str
    reward_points: int
    created_at: datetime

    model_config = {"from_attributes": True}
