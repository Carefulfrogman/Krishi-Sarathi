"""QR code generation and product tracing API routes."""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.supply_chain import SupplyChainEvent, SupplyChainEventResponse
from app.models.farm import Farm, Crop
from app.utils.firebase_auth import get_current_user

router = APIRouter()


@router.post("/generate")
async def generate_qr(
    farm_id: str,
    crop_id: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a unique QR code for a farm/crop product."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    short_id = str(uuid.uuid4())[:8].upper()
    farm_code = farm.name[:3].upper().replace(" ", "")

    crop_code = "GEN"
    if crop_id:
        crop = db.query(Crop).filter(Crop.id == crop_id, Crop.farm_id == farm_id).first()
        if crop:
            crop_code = crop.name[:3].upper().replace(" ", "")

    qr_code = f"QR-{farm_code}-{crop_code}-{short_id}"

    return {
        "qr_code": qr_code,
        "farm_id": farm_id,
        "crop_id": crop_id,
        "farm_name": farm.name,
        "trace_url": f"/api/qr/trace/{qr_code}",
    }


@router.get("/trace/{qr_code}")
async def trace_qr(
    qr_code: str,
    db: Session = Depends(get_db),
):
    """Trace a product using its QR code (public endpoint)."""
    events = (
        db.query(SupplyChainEvent)
        .filter(SupplyChainEvent.qr_code == qr_code)
        .order_by(SupplyChainEvent.event_date.asc())
        .all()
    )

    if not events:
        raise HTTPException(status_code=404, detail="No records found for this QR code")

    # Get farm info
    farm = db.query(Farm).filter(Farm.id == events[0].farm_id).first()

    # Get crop info if available
    crop_info = None
    if events[0].crop_id:
        crop = db.query(Crop).filter(Crop.id == events[0].crop_id).first()
        if crop:
            crop_info = {
                "name": crop.name,
                "variety": crop.variety,
                "health_status": crop.health_status,
            }

    return {
        "qr_code": qr_code,
        "farm": {
            "name": farm.name if farm else "Unknown",
            "location": farm.location if farm else None,
            "organic_certified": farm.organic_certified if farm else False,
        },
        "crop": crop_info,
        "events": [
            {
                "type": e.event_type,
                "description": e.description,
                "location": e.location,
                "actor": e.actor_name,
                "date": str(e.event_date),
            }
            for e in events
        ],
        "total_events": len(events),
    }


@router.get("/verify/{qr_code}")
async def verify_qr(
    qr_code: str,
    db: Session = Depends(get_db),
):
    """Verify if a QR code is valid and return basic info."""
    event_count = (
        db.query(SupplyChainEvent)
        .filter(SupplyChainEvent.qr_code == qr_code)
        .count()
    )
    return {
        "valid": event_count > 0,
        "qr_code": qr_code,
        "event_count": event_count,
    }
