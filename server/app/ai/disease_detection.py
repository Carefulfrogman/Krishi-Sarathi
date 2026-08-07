"""Plant disease detection using image analysis.

In production, this would use a trained deep learning model (e.g., ResNet).
Currently uses rule-based analysis with OpenCV preprocessing.
"""

import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Known plant diseases database
DISEASE_DATABASE = {
    "rice_blast": {
        "name": "Rice Blast",
        "crop": "Rice",
        "symptoms": "Diamond-shaped lesions on leaves",
        "treatment": "Apply fungicide (tricyclazole). Remove infected plants. Ensure proper spacing.",
        "severity_range": (40, 80),
    },
    "bacterial_leaf_blight": {
        "name": "Bacterial Leaf Blight",
        "crop": "Rice",
        "symptoms": "Water-soaked lesions turning yellow-white",
        "treatment": "Use resistant varieties. Apply copper-based bactericides.",
        "severity_range": (30, 70),
    },
    "tomato_late_blight": {
        "name": "Late Blight",
        "crop": "Tomato",
        "symptoms": "Dark brown patches on leaves and fruits",
        "treatment": "Apply mancozeb or copper fungicide. Remove infected parts.",
        "severity_range": (50, 90),
    },
    "powdery_mildew": {
        "name": "Powdery Mildew",
        "crop": "Various",
        "symptoms": "White powdery coating on leaves",
        "treatment": "Apply sulfur-based fungicide. Improve air circulation.",
        "severity_range": (20, 60),
    },
    "rust": {
        "name": "Rust",
        "crop": "Various",
        "symptoms": "Orange-brown pustules on undersides of leaves",
        "treatment": "Apply fungicide. Remove affected leaves. Avoid overhead watering.",
        "severity_range": (30, 75),
    },
    "tea_mosquito_bug": {
        "name": "Tea Mosquito Bug",
        "crop": "Tea",
        "symptoms": "Brown necrotic spots on young leaves and buds",
        "treatment": "Apply neem-based pesticide. Prune affected areas. Use shade regulation.",
        "severity_range": (25, 65),
    },
}


class DiseaseDetector:
    """Detects plant diseases from images and symptom descriptions."""

    def __init__(self):
        self.cv_available = False
        try:
            import cv2
            self.cv_available = True
        except ImportError:
            pass

    def detect_from_symptoms(self, crop: str, symptoms: str) -> List[Dict]:
        """Match symptoms to known diseases."""
        matches = []
        symptoms_lower = symptoms.lower()

        for disease_id, info in DISEASE_DATABASE.items():
            # Check if crop matches
            crop_match = (
                info["crop"].lower() == crop.lower()
                or info["crop"] == "Various"
            )

            # Simple keyword matching on symptoms
            symptom_keywords = info["symptoms"].lower().split()
            keyword_matches = sum(
                1 for kw in symptom_keywords
                if kw in symptoms_lower and len(kw) > 3
            )

            if crop_match and keyword_matches > 0:
                confidence = min(95, 40 + keyword_matches * 15)
                matches.append({
                    "disease_id": disease_id,
                    "name": info["name"],
                    "confidence": confidence,
                    "symptoms": info["symptoms"],
                    "treatment": info["treatment"],
                    "severity": "moderate",
                })

        if not matches:
            matches.append({
                "disease_id": "unknown",
                "name": "Unidentified Condition",
                "confidence": 30,
                "symptoms": "Could not match to known diseases",
                "treatment": "Consult a local agricultural expert for diagnosis.",
                "severity": "unknown",
            })

        return sorted(matches, key=lambda x: x["confidence"], reverse=True)

    def detect_from_image(self, image_path: str, crop: str = "") -> Dict:
        """Analyze an image for signs of disease.

        In production, this would use a trained CNN model.
        Currently uses color anomaly detection as a proxy.
        """
        if not self.cv_available:
            return {
                "detected": False,
                "message": "Image analysis not available",
                "recommendation": "Please describe symptoms for text-based detection.",
            }

        try:
            import cv2
            import numpy as np

            img = cv2.imread(image_path)
            if img is None:
                return {"error": "Could not read image"}

            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            total_pixels = img.shape[0] * img.shape[1]

            # Detect brown/yellow lesions (disease indicators)
            lower_brown = np.array([10, 50, 50])
            upper_brown = np.array([30, 255, 200])
            brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)
            brown_pct = (cv2.countNonZero(brown_mask) / total_pixels) * 100

            # Detect white spots (powdery mildew)
            lower_white = np.array([0, 0, 200])
            upper_white = np.array([180, 30, 255])
            white_mask = cv2.inRange(hsv, lower_white, upper_white)
            white_pct = (cv2.countNonZero(white_mask) / total_pixels) * 100

            disease_detected = brown_pct > 15 or white_pct > 10

            result = {
                "detected": disease_detected,
                "analysis_method": "image",
                "brown_lesion_percentage": round(brown_pct, 1),
                "white_spot_percentage": round(white_pct, 1),
            }

            if disease_detected:
                if white_pct > 10:
                    result["possible_disease"] = "Powdery Mildew"
                    result["confidence"] = min(85, 40 + white_pct)
                elif brown_pct > 15:
                    result["possible_disease"] = "Leaf Blight or Rust"
                    result["confidence"] = min(85, 30 + brown_pct)
                result["recommendation"] = "Consult an agricultural expert for confirmation."
            else:
                result["message"] = "No obvious disease symptoms detected"
                result["confidence"] = 75

            return result
        except Exception as e:
            logger.error(f"Disease detection image analysis failed: {e}")
            return {"error": str(e)}
