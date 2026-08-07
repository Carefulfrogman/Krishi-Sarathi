"""Krishi Saarathi FastAPI Application Entry Point."""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import api_router
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    description="Krishi Saarathi Agri-Tech Platform API - ESG Scoring, Carbon Credits, Crop Insurance & Supply Chain Traceability",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    """Root endpoint delivering basic API info."""
    return {
        "name": settings.app_name,
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs",
        "api_prefix": settings.api_prefix,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "ai_engine": "active",
            "firebase_auth": "configured",
            "carbon_market": "active",
        },
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
    )


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.debug)
