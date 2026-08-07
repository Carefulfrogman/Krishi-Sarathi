"""Supply chain tracking API routes."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.supply_chain import SupplyChainEvent, SupplyChainEventCreate, SupplyChainEventResponse
from app.models.farm import Farm
from app.utils.firebase_auth import get_current_user
from app.utils.helpers import generate_qr_code_id

router = APIRouter()


@router.get("/farm/{farm_id}", response_model=List[SupplyChainEventResponse])
async def list_supply_chain_events(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all supply chain events for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    events = (
        db.query(SupplyChainEvent)
        .filter(SupplyChainEvent.farm_id == farm_id)
        .order_by(SupplyChainEvent.event_date.asc())
        .all()
    )
    return events


@router.post("/events", response_model=SupplyChainEventResponse, status_code=201)
async def create_event(
    event_data: SupplyChainEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record a new supply chain event."""
    farm = db.query(Farm).filter(Farm.id == event_data.farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    event = SupplyChainEvent(**event_data.model_dump())

    # Generate QR code if not provided
    if not event.qr_code:
        crop_name = "CROP"
        if event_data.crop_id:
            from app.models.farm import Crop
            crop = db.query(Crop).filter(Crop.id == event_data.crop_id).first()
            if crop:
                crop_name = crop.name
        event.qr_code = generate_qr_code_id("QR", farm.name, crop_name)

    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/trace/{qr_code}", response_model=List[SupplyChainEventResponse])
async def trace_product(
    qr_code: str,
    db: Session = Depends(get_db),
):
    """Trace a product through its supply chain using QR code (public endpoint)."""
    events = (
        db.query(SupplyChainEvent)
        .filter(SupplyChainEvent.qr_code == qr_code)
        .order_by(SupplyChainEvent.event_date.asc())
        .all()
    )
    if not events:
        raise HTTPException(status_code=404, detail="No supply chain events found for this QR code")
    return events


@router.get("/crop/{crop_id}", response_model=List[SupplyChainEventResponse])
async def get_crop_supply_chain(
    crop_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all supply chain events for a specific crop."""
    events = (
        db.query(SupplyChainEvent)
        .filter(SupplyChainEvent.crop_id == crop_id)
        .order_by(SupplyChainEvent.event_date.asc())
        .all()
    )
    return events
