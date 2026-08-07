"""AI-powered sustainability scoring model.

Uses a combination of weighted metrics and optional scikit-learn models
to compute sustainability scores for farms.
"""

import logging
from typing import Dict, Optional

import numpy as np

logger = logging.getLogger(__name__)

# Weight configuration for sustainability scoring
CATEGORY_WEIGHTS = {
    "water": 0.20,
    "soil": 0.20,
    "biodiversity": 0.20,
    "carbon": 0.25,
    "waste": 0.15,
}


class SustainabilityModel:
    """Calculates sustainability scores from farm metrics."""

    def __init__(self):
        self.weights = CATEGORY_WEIGHTS
        self.model = None
        self._try_load_model()

    def _try_load_model(self):
        """Attempt to load a pre-trained sklearn model if available."""
        try:
            from sklearn.ensemble import GradientBoostingRegressor
            # In production, load from a saved model file.
            # For now, we use rule-based scoring.
            logger.info("Sustainability model initialized (rule-based mode)")
        except ImportError:
            logger.info("scikit-learn not available, using rule-based scoring")

    def calculate_water_score(self, data: Dict) -> float:
        """Score water usage efficiency (0–100)."""
        score = 50.0  # baseline

        irrigation = data.get("irrigation_type", "").lower()
        if irrigation in ("drip", "drip irrigation"):
            score += 30
        elif irrigation in ("sprinkler",):
            score += 20
        elif irrigation in ("canal", "flood"):
            score += 5

        if data.get("rainwater_harvesting", False):
            score += 10
        if data.get("water_recycling", False):
            score += 10

        return min(100, max(0, score))

    def calculate_soil_score(self, data: Dict) -> float:
        """Score soil health management (0–100)."""
        score = 50.0

        soil_type = data.get("soil_type", "").lower()
        if "loam" in soil_type:
            score += 10
        elif "clay" in soil_type:
            score += 5

        if data.get("organic_certified", False):
            score += 20
        if data.get("crop_rotation", False):
            score += 10
        if data.get("cover_crops", False):
            score += 10

        return min(100, max(0, score))

    def calculate_biodiversity_score(self, data: Dict) -> float:
        """Score biodiversity preservation (0–100)."""
        score = 40.0

        crop_count = data.get("crop_diversity", 1)
        score += min(30, crop_count * 10)

        if data.get("organic_certified", False):
            score += 15
        if data.get("pollinator_habitat", False):
            score += 15

        return min(100, max(0, score))

    def calculate_carbon_score(self, data: Dict) -> float:
        """Score carbon footprint reduction (0–100)."""
        score = 40.0

        area = data.get("area_hectares", 0)
        credits = data.get("carbon_credits", 0)
        if area > 0 and credits > 0:
            credits_per_hectare = credits / area
            score += min(40, credits_per_hectare * 10)

        if data.get("renewable_energy", False):
            score += 10
        if data.get("no_burn", True):
            score += 10

        return min(100, max(0, score))

    def calculate_waste_score(self, data: Dict) -> float:
        """Score waste management (0–100)."""
        score = 50.0

        if data.get("composting", False):
            score += 20
        if data.get("plastic_free", False):
            score += 15
        if data.get("waste_recycling", False):
            score += 15

        return min(100, max(0, score))

    def calculate_overall_score(self, data: Dict) -> Dict[str, float]:
        """Calculate all category scores and the weighted overall score."""
        water = self.calculate_water_score(data)
        soil = self.calculate_soil_score(data)
        biodiversity = self.calculate_biodiversity_score(data)
        carbon = self.calculate_carbon_score(data)
        waste = self.calculate_waste_score(data)

        overall = (
            water * self.weights["water"]
            + soil * self.weights["soil"]
            + biodiversity * self.weights["biodiversity"]
            + carbon * self.weights["carbon"]
            + waste * self.weights["waste"]
        )

        return {
            "overall_score": round(overall, 1),
            "water_score": round(water, 1),
            "soil_score": round(soil, 1),
            "biodiversity_score": round(biodiversity, 1),
            "carbon_score": round(carbon, 1),
            "waste_score": round(waste, 1),
        }

    def get_recommendations(self, scores: Dict[str, float]) -> list:
        """Generate improvement recommendations based on scores."""
        recommendations = []

        if scores.get("water_score", 0) < 60:
            recommendations.append({
                "category": "Water",
                "suggestion": "Consider upgrading to drip irrigation to improve water efficiency.",
                "potential_impact": "+15-30 points",
            })

        if scores.get("soil_score", 0) < 60:
            recommendations.append({
                "category": "Soil",
                "suggestion": "Implement crop rotation and cover cropping to improve soil health.",
                "potential_impact": "+10-20 points",
            })

        if scores.get("biodiversity_score", 0) < 60:
            recommendations.append({
                "category": "Biodiversity",
                "suggestion": "Increase crop diversity and create pollinator habitats.",
                "potential_impact": "+15-30 points",
            })

        if scores.get("carbon_score", 0) < 60:
            recommendations.append({
                "category": "Carbon",
                "suggestion": "Explore renewable energy options and carbon credit programs.",
                "potential_impact": "+10-20 points",
            })

        if scores.get("waste_score", 0) < 60:
            recommendations.append({
                "category": "Waste",
                "suggestion": "Start composting organic waste and reduce plastic usage.",
                "potential_impact": "+15-35 points",
            })

        if not recommendations:
            recommendations.append({
                "category": "General",
                "suggestion": "Excellent scores! Maintain current practices and consider mentoring other farmers.",
                "potential_impact": "Community impact",
            })

        return recommendations
