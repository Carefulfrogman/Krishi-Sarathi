"""Sustainability score API routes."""

from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.farm import Farm, SustainabilityScore, SustainabilityScoreResponse
from app.utils.firebase_auth import get_current_user
from app.ai.sustainability_model import SustainabilityModel

router = APIRouter()
model = SustainabilityModel()


@router.get("/farm/{farm_id}", response_model=List[SustainabilityScoreResponse])
async def get_sustainability_scores(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 12,
):
    """Get sustainability score history for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    scores = (
        db.query(SustainabilityScore)
        .filter(SustainabilityScore.farm_id == farm_id)
        .order_by(SustainabilityScore.assessment_date.desc())
        .limit(limit)
        .all()
    )
    return scores


@router.get("/farm/{farm_id}/latest", response_model=SustainabilityScoreResponse)
async def get_latest_score(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the latest sustainability score for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    score = (
        db.query(SustainabilityScore)
        .filter(SustainabilityScore.farm_id == farm_id)
        .order_by(SustainabilityScore.assessment_date.desc())
        .first()
    )
    if not score:
        raise HTTPException(status_code=404, detail="No sustainability scores found")
    return score


@router.post("/farm/{farm_id}/calculate")
async def calculate_sustainability(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Calculate a new sustainability score for a farm using AI."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # Gather farm data for scoring
    crop_count = db.query(Farm).join(Farm.crops).filter(Farm.id == farm_id).count()

    farm_data = {
        "irrigation_type": farm.irrigation_type or "",
        "soil_type": farm.soil_type or "",
        "organic_certified": farm.organic_certified,
        "area_hectares": farm.area_hectares or 0,
        "crop_diversity": max(1, crop_count),
    }

    # Calculate scores
    scores = model.calculate_overall_score(farm_data)

    # Save to database
    sustainability_score = SustainabilityScore(
        farm_id=farm_id,
        overall_score=scores["overall_score"],
        water_score=scores["water_score"],
        soil_score=scores["soil_score"],
        biodiversity_score=scores["biodiversity_score"],
        carbon_score=scores["carbon_score"],
        waste_score=scores["waste_score"],
        assessment_date=date.today(),
    )
    db.add(sustainability_score)
    db.commit()
    db.refresh(sustainability_score)

    # Get recommendations
    recommendations = model.get_recommendations(scores)

    return {
        "scores": scores,
        "recommendations": recommendations,
        "assessment_date": str(date.today()),
    }


@router.get("/recommendations/{farm_id}")
async def get_recommendations(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-powered sustainability improvement recommendations."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    latest_score = (
        db.query(SustainabilityScore)
        .filter(SustainabilityScore.farm_id == farm_id)
        .order_by(SustainabilityScore.assessment_date.desc())
        .first()
    )

    if not latest_score:
        return {"recommendations": [{"category": "General", "suggestion": "Calculate your first sustainability score to get personalized recommendations."}]}

    scores = {
        "water_score": latest_score.water_score,
        "soil_score": latest_score.soil_score,
        "biodiversity_score": latest_score.biodiversity_score,
        "carbon_score": latest_score.carbon_score,
        "waste_score": latest_score.waste_score,
    }

    recommendations = model.get_recommendations(scores)
    return {"recommendations": recommendations, "current_score": latest_score.overall_score}
