"""Crop health analysis using image processing and rule-based scoring."""

import logging
from typing import Dict, Optional, List

logger = logging.getLogger(__name__)


class CropHealthAnalyzer:
    """Analyzes crop health from images and sensor data."""

    # Health thresholds
    HEALTH_THRESHOLDS = {
        "excellent": 85,
        "good": 65,
        "fair": 45,
        "poor": 25,
        "critical": 0,
    }

    def __init__(self):
        self.cv_available = False
        try:
            import cv2
            self.cv_available = True
            logger.info("OpenCV available for crop health image analysis")
        except ImportError:
            logger.info("OpenCV not available. Using rule-based crop health analysis only.")

    def analyze_from_metrics(self, data: Dict) -> Dict:
        """Analyze crop health from environmental and management metrics."""
        score = 70.0  # baseline

        # Temperature impact
        temp = data.get("temperature", 25)
        if 20 <= temp <= 30:
            score += 10
        elif 15 <= temp <= 35:
            score += 5
        else:
            score -= 15

        # Humidity impact
        humidity = data.get("humidity", 60)
        if 50 <= humidity <= 75:
            score += 10
        elif humidity > 90:
            score -= 10  # risk of fungal disease

        # Rainfall
        rainfall = data.get("rainfall_mm", 10)
        if 5 <= rainfall <= 30:
            score += 5
        elif rainfall > 50:
            score -= 10  # flooding risk

        # Soil and management factors
        if data.get("organic_certified", False):
            score += 5
        if data.get("pesticide_free", False):
            score += 5

        score = min(100, max(0, score))

        # Determine health status
        health_status = "critical"
        for status, threshold in self.HEALTH_THRESHOLDS.items():
            if score >= threshold:
                health_status = status
                break

        return {
            "health_score": round(score, 1),
            "health_status": health_status,
            "analysis_method": "metrics",
            "factors": {
                "temperature_impact": "optimal" if 20 <= temp <= 30 else "suboptimal",
                "humidity_impact": "optimal" if 50 <= humidity <= 75 else "suboptimal",
                "rainfall_impact": "adequate" if 5 <= rainfall <= 30 else "excess/deficit",
            },
        }

    def analyze_from_image(self, image_path: str) -> Dict:
        """Analyze crop health from an image using OpenCV.

        In production, this would use a trained CNN model.
        Currently uses color analysis as a proxy.
        """
        if not self.cv_available:
            return {
                "health_score": 70.0,
                "health_status": "good",
                "analysis_method": "default",
                "note": "Image analysis not available (OpenCV not installed)",
            }

        try:
            import cv2
            import numpy as np

            img = cv2.imread(image_path)
            if img is None:
                return {"error": "Could not read image file"}

            # Convert to HSV for green detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

            # Define green color range (healthy vegetation)
            lower_green = np.array([25, 40, 40])
            upper_green = np.array([95, 255, 255])

            # Create mask for green areas
            mask = cv2.inRange(hsv, lower_green, upper_green)

            # Calculate green percentage
            total_pixels = mask.shape[0] * mask.shape[1]
            green_pixels = cv2.countNonZero(mask)
            green_percentage = (green_pixels / total_pixels) * 100

            # Score based on green content
            if green_percentage > 60:
                score = 90
                status = "excellent"
            elif green_percentage > 40:
                score = 75
                status = "good"
            elif green_percentage > 20:
                score = 55
                status = "fair"
            else:
                score = 30
                status = "poor"

            # Check for brown/yellow (stressed vegetation)
            lower_yellow = np.array([15, 40, 40])
            upper_yellow = np.array([35, 255, 255])
            yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
            yellow_pct = (cv2.countNonZero(yellow_mask) / total_pixels) * 100

            if yellow_pct > 30:
                score -= 20
                status = "fair" if score > 45 else "poor"

            return {
                "health_score": round(max(0, min(100, score)), 1),
                "health_status": status,
                "analysis_method": "image",
                "green_coverage": round(green_percentage, 1),
                "stress_indicators": round(yellow_pct, 1),
            }
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            return {
                "health_score": 70.0,
                "health_status": "good",
                "analysis_method": "default",
                "error": str(e),
            }

    def get_recommendations(self, health_data: Dict) -> List[str]:
        """Generate crop health improvement recommendations."""
        recommendations = []
        status = health_data.get("health_status", "good")

        if status in ("poor", "critical"):
            recommendations.append("Immediate soil testing recommended")
            recommendations.append("Check for pest infestations and diseases")
            recommendations.append("Review irrigation schedule and water quality")
        elif status == "fair":
            recommendations.append("Monitor crop closely for signs of stress")
            recommendations.append("Consider adjusting fertilization schedule")
            recommendations.append("Ensure adequate drainage")
        elif status == "good":
            recommendations.append("Maintain current practices")
            recommendations.append("Consider organic certification to increase value")
        else:
            recommendations.append("Excellent health! Document practices for replication")

        return recommendations
