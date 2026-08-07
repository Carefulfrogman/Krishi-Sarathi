"""Weather data API routes."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.farm import Farm, WeatherData, WeatherResponse
from app.utils.firebase_auth import get_current_user
from app.ai.disaster_detection import DisasterDetector

router = APIRouter()
detector = DisasterDetector()


@router.get("/farm/{farm_id}", response_model=List[WeatherResponse])
async def get_farm_weather(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 7,
):
    """Get weather data for a specific farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    weather = (
        db.query(WeatherData)
        .filter(WeatherData.farm_id == farm_id)
        .order_by(WeatherData.forecast_date.desc())
        .limit(limit)
        .all()
    )
    return weather


@router.get("/farm/{farm_id}/current")
async def get_current_weather(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the latest weather data for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    weather = (
        db.query(WeatherData)
        .filter(WeatherData.farm_id == farm_id)
        .order_by(WeatherData.forecast_date.desc())
        .first()
    )

    if not weather:
        # Return default weather if no data
        return {
            "temperature": 28.0,
            "humidity": 65.0,
            "rainfall_mm": 5.0,
            "wind_speed": 10.0,
            "condition": "Partly Cloudy",
            "farm_name": farm.name,
        }

    return {
        "temperature": weather.temperature,
        "humidity": weather.humidity,
        "rainfall_mm": weather.rainfall_mm,
        "wind_speed": weather.wind_speed,
        "condition": weather.condition,
        "forecast_date": str(weather.forecast_date),
        "farm_name": farm.name,
    }


@router.get("/farm/{farm_id}/alerts")
async def get_weather_alerts(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get weather-based disaster alerts for a farm."""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    weather = (
        db.query(WeatherData)
        .filter(WeatherData.farm_id == farm_id)
        .order_by(WeatherData.forecast_date.desc())
        .first()
    )

    if not weather:
        return {"alerts": [], "farm_name": farm.name}

    weather_dict = {
        "temperature": weather.temperature,
        "humidity": weather.humidity,
        "rainfall_mm": weather.rainfall_mm,
        "wind_speed": weather.wind_speed,
    }

    alerts = detector.check_weather_alerts(weather_dict)
    return {"alerts": alerts, "farm_name": farm.name}
