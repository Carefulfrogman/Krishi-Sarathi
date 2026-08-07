"""Firebase Admin SDK initialization and JWT token verification."""

import os
import logging
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

# Try to initialize Firebase Admin SDK
firebase_app = None
try:
    import firebase_admin
    from firebase_admin import credentials, auth as firebase_auth

    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
    else:
        logger.warning(
            f"Firebase credentials file not found at {cred_path}. "
            "Running in development mode without Firebase auth."
        )
except ImportError:
    logger.warning("firebase_admin not installed. Running without Firebase auth.")
except Exception as e:
    logger.warning(f"Failed to initialize Firebase: {e}. Running in dev mode.")


def verify_firebase_token(token: str) -> Optional[dict]:
    """Verify a Firebase ID token and return the decoded token."""
    if firebase_app is None:
        # Development mode: return mock user data
        return {
            "uid": "firebase_demo_user_1",
            "email": "ram@example.com",
            "name": "Ram Sharma",
        }

    try:
        from firebase_admin import auth as firebase_auth
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency to get the authenticated user.

    In development mode (no Firebase credentials), returns the first demo user.
    In production, verifies the Firebase JWT token and looks up the user.
    """
    if credentials is None:
        if firebase_app is None:
            # Dev mode: return demo user
            user = db.query(User).filter(
                User.firebase_uid == "firebase_demo_user_1"
            ).first()
            if user:
                return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = verify_firebase_token(credentials.credentials)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Find or create user in database
    user = db.query(User).filter(User.firebase_uid == token_data["uid"]).first()
    if user is None:
        # Auto-register new users
        user = User(
            firebase_uid=token_data["uid"],
            email=token_data.get("email", ""),
            display_name=token_data.get("name", ""),
            photo_url=token_data.get("picture", ""),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
