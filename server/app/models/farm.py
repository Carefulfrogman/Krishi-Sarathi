"""Farm and Crop ORM models and Pydantic schemas."""

import uuid
from datetime import datetime, date
from typing import Optional, List

from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel

from app.database.connection import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    location = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    area_hectares = Column(Float)
    soil_type = Column(String(100))
    irrigation_type = Column(String(100))
    organic_certified = Column(Boolean, default=False)
    description = Column(Text)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="farms")
    crops = relationship("Crop", back_populates="farm", cascade="all, delete-orphan")
    sustainability_scores = relationship("SustainabilityScore", back_populates="farm", cascade="all, delete-orphan")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    variety = Column(String(255))
    planting_date = Column(Date)
    expected_harvest = Column(Date)
    actual_harvest = Column(Date)
    area_hectares = Column(Float)
    yield_kg = Column(Float)
    health_status = Column(String(20), default="good")
    status = Column(String(20), default="growing")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="crops")


class SustainabilityScore(Base):
    __tablename__ = "sustainability_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=False)
    water_score = Column(Float, default=0)
    soil_score = Column(Float, default=0)
    biodiversity_score = Column(Float, default=0)
    carbon_score = Column(Float, default=0)
    waste_score = Column(Float, default=0)
    assessment_date = Column(Date, default=date.today)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="sustainability_scores")


class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"))
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall_mm = Column(Float)
    wind_speed = Column(Float)
    condition = Column(String(100))
    forecast_date = Column(Date)
    recorded_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# --- Pydantic Schemas ---

class CropCreate(BaseModel):
    name: str
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest: Optional[date] = None
    area_hectares: Optional[float] = None


class CropResponse(BaseModel):
    id: str
    farm_id: str
    name: str
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest: Optional[date] = None
    area_hectares: Optional[float] = None
    health_status: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class FarmCreate(BaseModel):
    name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    organic_certified: bool = False
    description: Optional[str] = None


class FarmResponse(BaseModel):
    id: str
    user_id: str
    name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    organic_certified: bool
    description: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class SustainabilityScoreResponse(BaseModel):
    id: str
    farm_id: str
    overall_score: float
    water_score: float
    soil_score: float
    biodiversity_score: float
    carbon_score: float
    waste_score: float
    assessment_date: date
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


class WeatherResponse(BaseModel):
    id: str
    farm_id: Optional[str] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall_mm: Optional[float] = None
    wind_speed: Optional[float] = None
    condition: Optional[str] = None
    forecast_date: Optional[date] = None
    recorded_at: datetime

    model_config = {"from_attributes": True}
