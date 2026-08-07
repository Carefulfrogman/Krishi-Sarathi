"""Farm management API routes."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.farm import Farm, Crop, FarmCreate, FarmResponse, CropCreate, CropResponse
from app.utils.firebase_auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[FarmResponse])
async def list_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status: Optional[str] = None,
):
    """List all farms for the authenticated user."""
    query = db.query(Farm).filter(Farm.user_id == current_user.id)
    if status:
        query = query.filter(Farm.status == status)
    farms = query.order_by(Farm.created_at.desc()).all()
    return farms


@router.post("/", response_model=FarmResponse, status_code=201)
async def create_farm(
    farm_data: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register a new farm."""
    farm = Farm(**farm_data.model_dump(), user_id=current_user.id)
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get details of a specific farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm


@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(
    farm_id: str,
    farm_data: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    for key, value in farm_data.model_dump(exclude_unset=True).items():
        setattr(farm, key, value)
    db.commit()
    db.refresh(farm)
    return farm


@router.delete("/{farm_id}")
async def delete_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    db.delete(farm)
    db.commit()
    return {"message": "Farm deleted successfully"}


# --- Crop endpoints ---

@router.get("/{farm_id}/crops", response_model=List[CropResponse])
async def list_crops(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all crops for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    crops = db.query(Crop).filter(Crop.farm_id == farm_id).order_by(Crop.created_at.desc()).all()
    return crops


@router.post("/{farm_id}/crops", response_model=CropResponse, status_code=201)
async def add_crop(
    farm_id: str,
    crop_data: CropCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new crop to a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    crop = Crop(**crop_data.model_dump(), farm_id=farm_id)
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop
