"""Insurance policy and claim management API routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.insurance import (
    InsurancePolicy, InsuranceClaim, DisasterReport,
    PolicyResponse, ClaimCreate, ClaimResponse,
)
from app.utils.firebase_auth import get_current_user
from app.ai.claim_verification import ClaimVerifier

router = APIRouter()
verifier = ClaimVerifier()


@router.get("/policies", response_model=List[PolicyResponse])
async def list_policies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all insurance policies for the user."""
    policies = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.user_id == current_user.id)
        .order_by(InsurancePolicy.created_at.desc())
        .all()
    )
    return policies


@router.get("/policies/{policy_id}", response_model=PolicyResponse)
async def get_policy(
    policy_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get details of a specific insurance policy."""
    policy = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.id == policy_id, InsurancePolicy.user_id == current_user.id)
        .first()
    )
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.get("/claims", response_model=List[ClaimResponse])
async def list_claims(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all insurance claims for the user."""
    claims = (
        db.query(InsuranceClaim)
        .filter(InsuranceClaim.user_id == current_user.id)
        .order_by(InsuranceClaim.submitted_at.desc())
        .all()
    )
    return claims


@router.post("/claims", response_model=ClaimResponse, status_code=201)
async def file_claim(
    claim_data: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """File a new insurance claim with AI verification."""
    # Verify policy exists and belongs to user
    policy = (
        db.query(InsurancePolicy)
        .filter(
            InsurancePolicy.id == claim_data.policy_id,
            InsurancePolicy.user_id == current_user.id,
            InsurancePolicy.status == "active",
        )
        .first()
    )
    if not policy:
        raise HTTPException(status_code=404, detail="Active policy not found")

    # Check for matching disaster report
    disaster = (
        db.query(DisasterReport)
        .filter(DisasterReport.farm_id == policy.farm_id)
        .order_by(DisasterReport.reported_at.desc())
        .first()
    )

    # Create claim
    claim = InsuranceClaim(
        user_id=current_user.id,
        **claim_data.model_dump(),
    )

    # AI verification
    claim_dict = claim_data.model_dump()
    claim_dict["farm_id"] = str(policy.farm_id)

    disaster_dict = None
    if disaster:
        disaster_dict = {
            "disaster_type": disaster.disaster_type,
            "severity": disaster.severity,
            "farm_id": str(disaster.farm_id),
            "verified": disaster.verified,
            "reported_at": str(disaster.reported_at),
        }

    farm_dict = {
        "coverage_amount": policy.coverage_amount,
        "area_hectares": None,
        "organic_certified": False,
        "status": "active",
    }

    verification = verifier.verify_claim(claim_dict, disaster_dict, farm_dict)
    claim.ai_verification_score = verification["verification_score"]

    if verification["verdict"] == "approved":
        claim.status = "verified"
    elif verification["verdict"] == "flagged":
        claim.status = "under_review"

    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


@router.get("/claims/{claim_id}", response_model=ClaimResponse)
async def get_claim(
    claim_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get details of a specific insurance claim."""
    claim = (
        db.query(InsuranceClaim)
        .filter(InsuranceClaim.id == claim_id, InsuranceClaim.user_id == current_user.id)
        .first()
    )
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim
