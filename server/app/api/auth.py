"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserCreate, UserResponse, UserUpdate
from app.utils.firebase_auth import get_current_user, verify_firebase_token

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user after Firebase authentication."""
    existing = db.query(User).filter(User.firebase_uid == user_data.firebase_uid).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered")

    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(**user_data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated user's profile."""
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/verify-token")
async def verify_token(token: str):
    """Verify a Firebase ID token."""
    result = verify_firebase_token(token)
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"valid": True, "uid": result.get("uid"), "email": result.get("email")}
