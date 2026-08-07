from fastapi import APIRouter

from . import (
    auth,
    farms,
    sustainability,
    carbon,
    marketplace,
    insurance,
    disaster,
    supplychain,
    qr,
    weather,
    notifications,
    analytics,
    ai,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(farms.router, prefix="/farms", tags=["Farms"])
api_router.include_router(sustainability.router, prefix="/sustainability", tags=["Sustainability"])
api_router.include_router(carbon.router, prefix="/carbon", tags=["Carbon Credits"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
api_router.include_router(insurance.router, prefix="/insurance", tags=["Insurance"])
api_router.include_router(disaster.router, prefix="/disasters", tags=["Disasters"])
api_router.include_router(supplychain.router, prefix="/supplychain", tags=["Supply Chain"])
api_router.include_router(qr.router, prefix="/qr", tags=["QR Codes"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Assistant"])

__all__ = ["api_router"]
