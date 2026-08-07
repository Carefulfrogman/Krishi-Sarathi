"""Analytics and reporting API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.farm import Farm, Crop, SustainabilityScore
from app.models.carbon import CarbonCredit, CarbonTransaction
from app.models.insurance import InsuranceClaim, DisasterReport
from app.models.notification import Reward
from app.utils.firebase_auth import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get comprehensive dashboard analytics."""
    # Farm stats
    farm_count = db.query(Farm).filter(Farm.user_id == current_user.id).count()
    active_farms = db.query(Farm).filter(Farm.user_id == current_user.id, Farm.status == "active").count()

    total_area = (
        db.query(func.sum(Farm.area_hectares))
        .filter(Farm.user_id == current_user.id)
        .scalar() or 0
    )

    # Crop stats
    crop_count = (
        db.query(Crop)
        .join(Farm)
        .filter(Farm.user_id == current_user.id)
        .count()
    )

    # Latest sustainability score
    latest_score = (
        db.query(SustainabilityScore)
        .join(Farm)
        .filter(Farm.user_id == current_user.id)
        .order_by(SustainabilityScore.assessment_date.desc())
        .first()
    )

    # Carbon credits
    total_credits = (
        db.query(func.sum(CarbonCredit.credits_amount))
        .filter(CarbonCredit.user_id == current_user.id)
        .scalar() or 0
    )
    available_credits = (
        db.query(func.sum(CarbonCredit.credits_available))
        .filter(CarbonCredit.user_id == current_user.id)
        .scalar() or 0
    )

    # Revenue
    total_revenue = (
        db.query(func.sum(CarbonTransaction.total_price))
        .filter(CarbonTransaction.seller_id == current_user.id, CarbonTransaction.status == "completed")
        .scalar() or 0
    )

    # Pending claims
    pending_claims = (
        db.query(InsuranceClaim)
        .filter(
            InsuranceClaim.user_id == current_user.id,
            InsuranceClaim.status.in_(["submitted", "under_review"]),
        )
        .count()
    )

    # Rewards
    total_reward_points = current_user.reward_points

    return {
        "farms": {
            "total": farm_count,
            "active": active_farms,
            "total_area_hectares": round(total_area, 1),
        },
        "crops": {
            "total": crop_count,
        },
        "sustainability": {
            "latest_score": latest_score.overall_score if latest_score else None,
            "water_score": latest_score.water_score if latest_score else None,
            "soil_score": latest_score.soil_score if latest_score else None,
            "biodiversity_score": latest_score.biodiversity_score if latest_score else None,
            "carbon_score": latest_score.carbon_score if latest_score else None,
            "waste_score": latest_score.waste_score if latest_score else None,
        },
        "carbon": {
            "total_credits": total_credits,
            "available_credits": available_credits,
            "total_revenue": float(total_revenue),
        },
        "insurance": {
            "pending_claims": pending_claims,
        },
        "rewards": {
            "total_points": total_reward_points,
        },
    }


@router.get("/reports/sustainability")
async def sustainability_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a detailed sustainability report across all farms."""
    farms = db.query(Farm).filter(Farm.user_id == current_user.id).all()

    farm_reports = []
    for farm in farms:
        scores = (
            db.query(SustainabilityScore)
            .filter(SustainabilityScore.farm_id == farm.id)
            .order_by(SustainabilityScore.assessment_date.desc())
            .limit(6)
            .all()
        )

        farm_reports.append({
            "farm_id": str(farm.id),
            "farm_name": farm.name,
            "location": farm.location,
            "area_hectares": farm.area_hectares,
            "organic_certified": farm.organic_certified,
            "score_history": [
                {
                    "date": str(s.assessment_date),
                    "overall": s.overall_score,
                    "water": s.water_score,
                    "soil": s.soil_score,
                    "biodiversity": s.biodiversity_score,
                    "carbon": s.carbon_score,
                    "waste": s.waste_score,
                }
                for s in scores
            ],
        })

    return {"farms": farm_reports}


@router.get("/reports/carbon")
async def carbon_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a detailed carbon credit report."""
    credits = (
        db.query(CarbonCredit)
        .filter(CarbonCredit.user_id == current_user.id)
        .all()
    )

    transactions = (
        db.query(CarbonTransaction)
        .filter(
            (CarbonTransaction.seller_id == current_user.id)
            | (CarbonTransaction.buyer_id == current_user.id)
        )
        .order_by(CarbonTransaction.transaction_date.desc())
        .all()
    )

    return {
        "credits": [
            {
                "id": str(c.id),
                "farm_id": str(c.farm_id),
                "amount": c.credits_amount,
                "available": c.credits_available,
                "status": c.verification_status,
                "period": f"{c.period_start} to {c.period_end}" if c.period_start else None,
            }
            for c in credits
        ],
        "transactions": [
            {
                "id": str(t.id),
                "type": "sale" if str(t.seller_id) == str(current_user.id) else "purchase",
                "amount": t.amount,
                "price_per_credit": t.price_per_credit,
                "total": t.total_price,
                "status": t.status,
                "date": str(t.transaction_date),
            }
            for t in transactions
        ],
        "summary": {
            "total_earned": sum(c.credits_amount for c in credits),
            "total_available": sum(c.credits_available for c in credits),
            "total_revenue": sum(
                t.total_price for t in transactions
                if str(t.seller_id) == str(current_user.id) and t.status == "completed"
            ),
        },
    }


@router.get("/rewards")
async def get_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user rewards and achievement data."""
    rewards = (
        db.query(Reward)
        .filter(Reward.user_id == current_user.id)
        .order_by(Reward.earned_at.desc())
        .all()
    )

    by_type = {}
    for r in rewards:
        rtype = r.reward_type or "other"
        if rtype not in by_type:
            by_type[rtype] = {"count": 0, "points": 0}
        by_type[rtype]["count"] += 1
        by_type[rtype]["points"] += r.points

    return {
        "total_points": current_user.reward_points,
        "rewards": [
            {
                "id": str(r.id),
                "title": r.title,
                "description": r.description,
                "points": r.points,
                "type": r.reward_type,
                "earned_at": str(r.earned_at),
            }
            for r in rewards
        ],
        "by_category": by_type,
    }
