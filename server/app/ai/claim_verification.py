"""Insurance claim verification using AI analysis."""

import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class ClaimVerifier:
    """Verifies insurance claims using disaster reports, farm data, and evidence."""

    # Verification criteria weights
    CRITERIA_WEIGHTS = {
        "disaster_match": 0.25,
        "timing_consistency": 0.20,
        "damage_plausibility": 0.20,
        "evidence_quality": 0.20,
        "historical_record": 0.15,
    }

    def verify_claim(self, claim_data: Dict, disaster_data: Optional[Dict] = None, farm_data: Optional[Dict] = None) -> Dict:
        """Perform comprehensive claim verification."""
        scores = {}

        # 1. Disaster match verification
        scores["disaster_match"] = self._verify_disaster_match(claim_data, disaster_data)

        # 2. Timing consistency
        scores["timing_consistency"] = self._verify_timing(claim_data, disaster_data)

        # 3. Damage plausibility
        scores["damage_plausibility"] = self._verify_damage_amount(claim_data, farm_data)

        # 4. Evidence quality
        scores["evidence_quality"] = self._assess_evidence(claim_data)

        # 5. Historical record
        scores["historical_record"] = self._check_history(claim_data, farm_data)

        # Calculate weighted overall score
        overall = sum(
            scores[key] * self.CRITERIA_WEIGHTS[key]
            for key in scores
        )

        # Determine verdict
        if overall >= 75:
            verdict = "approved"
            recommendation = "Claim appears legitimate. Recommend approval."
        elif overall >= 50:
            verdict = "review"
            recommendation = "Claim requires manual review by a claims adjuster."
        else:
            verdict = "flagged"
            recommendation = "Claim has inconsistencies. Flag for investigation."

        return {
            "verification_score": round(overall, 1),
            "verdict": verdict,
            "recommendation": recommendation,
            "criteria_scores": {k: round(v, 1) for k, v in scores.items()},
            "flags": self._generate_flags(scores, claim_data),
        }

    def _verify_disaster_match(self, claim: Dict, disaster: Optional[Dict]) -> float:
        """Check if claim matches a verified disaster report."""
        if disaster is None:
            return 40.0  # No disaster report - moderate concern

        score = 50.0

        # Type match
        claim_type = claim.get("claim_type", "").lower()
        disaster_type = disaster.get("disaster_type", "").lower()
        if disaster_type in claim_type or claim_type in disaster_type:
            score += 25

        # Location match
        if disaster.get("farm_id") == claim.get("farm_id"):
            score += 15

        # Verified disaster
        if disaster.get("verified", False):
            score += 10

        return min(100, score)

    def _verify_timing(self, claim: Dict, disaster: Optional[Dict]) -> float:
        """Verify timing consistency between disaster and claim."""
        if disaster is None:
            return 50.0

        score = 60.0

        # In a real system, compare timestamps
        # For now, assume reasonable timing if disaster exists
        if disaster.get("reported_at") and claim.get("submitted_at"):
            score += 20

        # Claims filed very quickly after disaster are normal
        score += 10

        return min(100, score)

    def _verify_damage_amount(self, claim: Dict, farm: Optional[Dict]) -> float:
        """Check if claimed damage amount is plausible."""
        claimed = claim.get("claimed_amount", 0)
        damage = claim.get("damage_amount", 0)

        if claimed <= 0:
            return 50.0

        score = 60.0

        # Claim should not exceed damage
        if damage > 0 and claimed <= damage:
            score += 20
        elif damage > 0 and claimed > damage * 1.5:
            score -= 30  # Suspicious overclaim

        # Check against farm value if available
        if farm:
            coverage = farm.get("coverage_amount", 0)
            if coverage > 0 and claimed <= coverage:
                score += 15
            elif coverage > 0 and claimed > coverage:
                score -= 20  # Exceeds coverage

            area = farm.get("area_hectares", 0)
            if area > 0 and claimed > 0:
                per_hectare = claimed / area
                if per_hectare < 200000:  # Reasonable per-hectare damage
                    score += 5

        return max(0, min(100, score))

    def _assess_evidence(self, claim: Dict) -> float:
        """Assess the quality and quantity of supporting evidence."""
        evidence_urls = claim.get("evidence_urls", []) or []
        score = 30.0

        # More evidence is better
        if len(evidence_urls) >= 5:
            score += 40
        elif len(evidence_urls) >= 3:
            score += 30
        elif len(evidence_urls) >= 1:
            score += 20

        # Has description
        if claim.get("description") and len(claim.get("description", "")) > 50:
            score += 15

        # Has specific damage amount
        if claim.get("damage_amount", 0) > 0:
            score += 15

        return min(100, score)

    def _check_history(self, claim: Dict, farm: Optional[Dict]) -> float:
        """Check historical claim patterns."""
        # In a real system, this would query historical claims
        # For now, give a neutral-to-positive score
        score = 70.0

        if farm:
            # Organic farms typically have better records
            if farm.get("organic_certified", False):
                score += 10

            # Active farm status
            if farm.get("status") == "active":
                score += 10

        return min(100, score)

    def _generate_flags(self, scores: Dict, claim: Dict) -> List[str]:
        """Generate warning flags for the claim."""
        flags = []

        if scores.get("disaster_match", 100) < 50:
            flags.append("No matching disaster report found")

        if scores.get("damage_plausibility", 100) < 40:
            flags.append("Claimed amount appears disproportionate to damage")

        if scores.get("evidence_quality", 100) < 40:
            flags.append("Insufficient supporting evidence provided")

        if scores.get("timing_consistency", 100) < 40:
            flags.append("Timing inconsistency detected")

        if not claim.get("evidence_urls"):
            flags.append("No photographic evidence submitted")

        return flags
