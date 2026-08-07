"""Common helper utilities."""

from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Query


def paginate(
    query: Query,
    page: int = 1,
    per_page: int = 20,
) -> Dict[str, Any]:
    """Paginate a SQLAlchemy query and return structured response."""
    page = max(1, page)
    per_page = min(max(1, per_page), 100)

    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


def format_error(message: str, details: Optional[Dict] = None) -> Dict[str, Any]:
    """Format a consistent error response."""
    error = {"error": message}
    if details:
        error["details"] = details
    return error


def generate_qr_code_id(prefix: str, farm_name: str, crop_name: str) -> str:
    """Generate a unique QR code identifier."""
    import uuid
    short_id = str(uuid.uuid4())[:8].upper()
    farm_short = farm_name[:3].upper().replace(" ", "")
    crop_short = crop_name[:3].upper().replace(" ", "")
    return f"{prefix}-{farm_short}-{crop_short}-{short_id}"
