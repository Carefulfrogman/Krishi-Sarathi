"""Disaster event detection and severity estimation."""

import logging
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Disaster severity factors
SEVERITY_FACTORS = {
    "flood": {
        "area_weight": 0.3,
        "duration_weight": 0.25,
        "depth_weight": 0.25,
        "crop_impact_weight": 0.2,
    },
    "drought": {
        "duration_weight": 0.35,
        "moisture_deficit_weight": 0.3,
        "crop_stage_weight": 0.2,
        "area_weight": 0.15,
    },
    "storm": {
        "wind_speed_weight": 0.35,
        "rainfall_weight": 0.25,
        "duration_weight": 0.2,
        "area_weight": 0.2,
    },
    "pest": {
        "spread_rate_weight": 0.3,
        "area_weight": 0.25,
        "crop_damage_weight": 0.25,
        "type_weight": 0.2,
    },
}


class DisasterDetector:
    """Detects and assesses severity of natural disasters affecting farms."""

    def assess_severity(self, data: Dict) -> Dict:
        """Assess the severity of a reported disaster."""
        disaster_type = data.get("disaster_type", "other").lower()
        severity_input = data.get("severity", "moderate")

        # Base score from reported severity
        severity_scores = {
            "minor": 25,
            "moderate": 50,
            "severe": 75,
            "catastrophic": 95,
        }
        base_score = severity_scores.get(severity_input, 50)

        # Adjust based on additional data
        adjustments = 0

        # Area affected
        area_affected = data.get("area_affected_pct", 50)
        if area_affected > 80:
            adjustments += 15
        elif area_affected > 50:
            adjustments += 8
        elif area_affected < 20:
            adjustments -= 10

        # Duration
        duration_days = data.get("duration_days", 1)
        if duration_days > 7:
            adjustments += 10
        elif duration_days > 3:
            adjustments += 5

        # Crop stage impact
        crop_stage = data.get("crop_stage", "growing")
        if crop_stage in ("flowering", "fruiting"):
            adjustments += 10  # more vulnerable stages

        final_score = max(0, min(100, base_score + adjustments))

        # Determine severity label
        if final_score >= 85:
            severity_label = "catastrophic"
        elif final_score >= 65:
            severity_label = "severe"
        elif final_score >= 35:
            severity_label = "moderate"
        else:
            severity_label = "minor"

        return {
            "severity_score": round(final_score, 1),
            "severity_label": severity_label,
            "disaster_type": disaster_type,
            "risk_factors": self._get_risk_factors(disaster_type, data),
            "recommended_actions": self._get_actions(disaster_type, severity_label),
            "estimated_recovery_days": self._estimate_recovery(severity_label),
        }

    def _get_risk_factors(self, disaster_type: str, data: Dict) -> List[str]:
        """Identify contributing risk factors."""
        factors = []

        if disaster_type == "flood":
            if data.get("rainfall_mm", 0) > 100:
                factors.append("Extreme rainfall exceeding 100mm")
            if data.get("low_elevation", False):
                factors.append("Farm located in low-elevation flood-prone area")
            if not data.get("drainage_system", False):
                factors.append("Insufficient drainage infrastructure")

        elif disaster_type == "drought":
            if data.get("days_without_rain", 0) > 14:
                factors.append(f"No rainfall for {data.get('days_without_rain')} days")
            if data.get("irrigation_type", "") == "rainfed":
                factors.append("Farm depends solely on rainfall")

        elif disaster_type == "pest":
            if not data.get("organic_certified", False):
                factors.append("Non-organic practices may attract pests")
            if data.get("monoculture", False):
                factors.append("Monoculture increases pest vulnerability")

        if not factors:
            factors.append("Standard risk factors for the region")

        return factors

    def _get_actions(self, disaster_type: str, severity: str) -> List[str]:
        """Get recommended immediate actions."""
        actions = []

        if severity in ("severe", "catastrophic"):
            actions.append("File insurance claim immediately")
            actions.append("Document all damage with photographs")
            actions.append("Contact local agricultural extension office")

        if disaster_type == "flood":
            actions.append("Drain standing water as soon as safe")
            actions.append("Assess soil contamination risk")
            actions.append("Check crop salvageability")
        elif disaster_type == "drought":
            actions.append("Activate emergency irrigation if available")
            actions.append("Apply mulch to retain soil moisture")
            actions.append("Prioritize water for most valuable crops")
        elif disaster_type == "pest":
            actions.append("Identify pest species for targeted treatment")
            actions.append("Isolate affected areas to prevent spread")
            actions.append("Consider biological control methods")
        elif disaster_type == "storm":
            actions.append("Secure structures and equipment")
            actions.append("Harvest any ready crops immediately")
            actions.append("Provide support for damaged plants")

        return actions

    def _estimate_recovery(self, severity: str) -> int:
        """Estimate recovery time in days."""
        recovery_map = {
            "minor": 14,
            "moderate": 45,
            "severe": 90,
            "catastrophic": 180,
        }
        return recovery_map.get(severity, 60)

    def check_weather_alerts(self, weather_data: Dict) -> List[Dict]:
        """Check weather data for potential disaster conditions."""
        alerts = []

        temp = weather_data.get("temperature", 25)
        humidity = weather_data.get("humidity", 60)
        rainfall = weather_data.get("rainfall_mm", 0)
        wind_speed = weather_data.get("wind_speed", 0)

        if rainfall > 80:
            alerts.append({
                "type": "flood",
                "level": "high",
                "message": f"Excessive rainfall ({rainfall}mm). Flood risk elevated.",
            })
        elif rainfall > 50:
            alerts.append({
                "type": "flood",
                "level": "medium",
                "message": f"Heavy rainfall ({rainfall}mm). Monitor water levels.",
            })

        if temp > 40:
            alerts.append({
                "type": "heat",
                "level": "high",
                "message": f"Extreme heat ({temp}°C). Crop stress likely.",
            })

        if wind_speed > 60:
            alerts.append({
                "type": "storm",
                "level": "high",
                "message": f"Strong winds ({wind_speed} km/h). Storm warning.",
            })

        if humidity > 90 and temp > 25:
            alerts.append({
                "type": "disease",
                "level": "medium",
                "message": "High humidity with warm temperatures increases disease risk.",
            })

        return alerts
