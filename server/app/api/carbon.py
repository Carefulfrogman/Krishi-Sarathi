"""Carbon credit management API routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.carbon import CarbonCredit, CarbonTransaction, CarbonCreditResponse, TransactionResponse
from app.utils.firebase_auth import get_current_user

router = APIRouter()


@router.get("/credits", response_model=List[CarbonCreditResponse])
async def list_carbon_credits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all carbon credits for the authenticated user."""
    credits = (
        db.query(CarbonCredit)
        .filter(CarbonCredit.user_id == current_user.id)
        .order_by(CarbonCredit.created_at.desc())
        .all()
    )
    return credits


@router.get("/credits/summary")
async def get_credits_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a summary of the user's carbon credits."""
    credits = db.query(CarbonCredit).filter(CarbonCredit.user_id == current_user.id).all()

    total_earned = sum(c.credits_amount for c in credits)
    total_available = sum(c.credits_available for c in credits)
    total_sold = total_earned - total_available
    verified_count = sum(1 for c in credits if c.verification_status == "verified")

    # Calculate revenue from completed transactions
    transactions = (
        db.query(CarbonTransaction)
        .filter(CarbonTransaction.seller_id == current_user.id, CarbonTransaction.status == "completed")
        .all()
    )
    total_revenue = sum(t.total_price for t in transactions)

    return {
        "total_credits_earned": total_earned,
        "credits_available": total_available,
        "credits_sold": total_sold,
        "verified_credits": verified_count,
        "total_revenue": total_revenue,
    }


@router.get("/transactions", response_model=List[TransactionResponse])
async def list_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List carbon credit transactions for the user (as buyer or seller)."""
    transactions = (
        db.query(CarbonTransaction)
        .filter(
            (CarbonTransaction.seller_id == current_user.id)
            | (CarbonTransaction.buyer_id == current_user.id)
        )
        .order_by(CarbonTransaction.transaction_date.desc())
        .all()
    )
    return transactions


@router.get("/credits/{credit_id}", response_model=CarbonCreditResponse)
async def get_credit_details(
    credit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get details of a specific carbon credit."""
    credit = (
        db.query(CarbonCredit)
        .filter(CarbonCredit.id == credit_id, CarbonCredit.user_id == current_user.id)
        .first()
    )
    if not credit:
        raise HTTPException(status_code=404, detail="Carbon credit not found")
    return credit
