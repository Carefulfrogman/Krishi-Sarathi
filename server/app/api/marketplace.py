"""Marketplace API routes for buying/selling carbon credits."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.carbon import (
    MarketplaceListing, CarbonCredit, CarbonTransaction,
    ListingCreate, ListingResponse, PurchaseRequest,
)
from app.utils.firebase_auth import get_current_user

router = APIRouter()


@router.get("/listings", response_model=List[ListingResponse])
async def list_marketplace(
    db: Session = Depends(get_db),
    status: str = "active",
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "listed_at",
):
    """List marketplace listings (public, no auth required for browsing)."""
    query = db.query(MarketplaceListing).filter(MarketplaceListing.status == status)

    if min_price is not None:
        query = query.filter(MarketplaceListing.price_per_credit >= min_price)
    if max_price is not None:
        query = query.filter(MarketplaceListing.price_per_credit <= max_price)

    if sort_by == "price_asc":
        query = query.order_by(MarketplaceListing.price_per_credit.asc())
    elif sort_by == "price_desc":
        query = query.order_by(MarketplaceListing.price_per_credit.desc())
    else:
        query = query.order_by(MarketplaceListing.listed_at.desc())

    listings = query.all()
    return listings


@router.post("/listings", response_model=ListingResponse, status_code=201)
async def create_listing(
    listing_data: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new marketplace listing."""
    credit = (
        db.query(CarbonCredit)
        .filter(
            CarbonCredit.id == listing_data.credit_id,
            CarbonCredit.user_id == current_user.id,
            CarbonCredit.verification_status == "verified",
        )
        .first()
    )
    if not credit:
        raise HTTPException(status_code=404, detail="Verified carbon credit not found")

    if credit.credits_available < listing_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient available credits")

    listing = MarketplaceListing(
        seller_id=current_user.id,
        **listing_data.model_dump(),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.post("/purchase")
async def purchase_credits(
    purchase: PurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Purchase carbon credits from a listing."""
    listing = (
        db.query(MarketplaceListing)
        .filter(MarketplaceListing.id == purchase.listing_id, MarketplaceListing.status == "active")
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or no longer active")

    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot purchase your own listing")

    if purchase.amount < listing.min_purchase:
        raise HTTPException(status_code=400, detail=f"Minimum purchase is {listing.min_purchase} credits")

    if purchase.amount > listing.amount:
        raise HTTPException(status_code=400, detail="Requested amount exceeds available")

    total_price = purchase.amount * listing.price_per_credit

    # Create transaction
    transaction = CarbonTransaction(
        seller_id=listing.seller_id,
        buyer_id=current_user.id,
        credit_id=listing.credit_id,
        amount=purchase.amount,
        price_per_credit=listing.price_per_credit,
        total_price=total_price,
        status="completed",
    )
    db.add(transaction)

    # Update listing
    listing.amount -= purchase.amount
    if listing.amount <= 0:
        listing.status = "sold"

    # Update credit availability
    credit = db.query(CarbonCredit).filter(CarbonCredit.id == listing.credit_id).first()
    if credit:
        credit.credits_available -= purchase.amount

    db.commit()

    return {
        "message": "Purchase successful",
        "transaction_id": str(transaction.id),
        "amount": purchase.amount,
        "total_price": total_price,
    }


@router.get("/my-listings", response_model=List[ListingResponse])
async def my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's marketplace listings."""
    listings = (
        db.query(MarketplaceListing)
        .filter(MarketplaceListing.seller_id == current_user.id)
        .order_by(MarketplaceListing.listed_at.desc())
        .all()
    )
    return listings


@router.delete("/listings/{listing_id}")
async def cancel_listing(
    listing_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel a marketplace listing."""
    listing = (
        db.query(MarketplaceListing)
        .filter(
            MarketplaceListing.id == listing_id,
            MarketplaceListing.seller_id == current_user.id,
            MarketplaceListing.status == "active",
        )
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Active listing not found")

    listing.status = "cancelled"
    db.commit()
    return {"message": "Listing cancelled successfully"}
