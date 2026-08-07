"""Application configuration loaded from environment variables."""

import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/ecotrace"
    )

    # Firebase
    firebase_credentials_path: str = os.getenv(
        "FIREBASE_CREDENTIALS_PATH",
        "firebase-credentials.json"
    )

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    # App
    app_name: str = "Krishi Saarathi API"
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    api_prefix: str = "/api"

    # AI Integration
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")


settings = Settings()
