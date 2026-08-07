"""Disaster reporting and detection API routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.insurance import DisasterReport, DisasterReportCreate, DisasterReportResponse
from app.utils.firebase_auth import get_current_user
from app.ai.disaster_detection import DisasterDetector

router = APIRouter()
detector = DisasterDetector()


@router.get("/", response_model=List[DisasterReportResponse])
async def list_disasters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List disaster reports for the user."""
    reports = (
        db.query(DisasterReport)
        .filter(DisasterReport.user_id == current_user.id)
        .order_by(DisasterReport.reported_at.desc())
        .all()
    )
    return reports


@router.post("/", response_model=DisasterReportResponse, status_code=201)
async def report_disaster(
    report_data: DisasterReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Report a new disaster with AI severity assessment."""
    # AI severity assessment
    assessment = detector.assess_severity(report_data.model_dump())

    report = DisasterReport(
        user_id=current_user.id,
        ai_severity_score=assessment["severity_score"],
        **report_data.model_dump(),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/{report_id}", response_model=DisasterReportResponse)
async def get_disaster_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get details of a disaster report."""
    report = (
        db.query(DisasterReport)
        .filter(DisasterReport.id == report_id, DisasterReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Disaster report not found")
    return report


@router.get("/{report_id}/assessment")
async def get_disaster_assessment(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI assessment for a disaster report."""
    report = (
        db.query(DisasterReport)
        .filter(DisasterReport.id == report_id, DisasterReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Disaster report not found")

    assessment = detector.assess_severity({
        "disaster_type": report.disaster_type,
        "severity": report.severity,
    })
    return assessment
