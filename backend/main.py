from __future__ import annotations

import random
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="FarmPulse AI Backend", version="0.1.0")

StateName = Literal["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"]
StressType = Literal["water stress", "heat stress", "nutrient deficiency", "healthy"]

LOW_NDVI_THRESHOLD = 0.45
LOW_NDWI_THRESHOLD = 0.30
HIGH_TEMP_THRESHOLD = 37.0
NORMAL_MOISTURE_NDWI_THRESHOLD = 0.30

STATE_VILLAGES: dict[StateName, list[str]] = {
    "Punjab": ["Mansa", "Barnala", "Sangrur", "Moga", "Fazilka", "Muktsar"],
    "Haryana": ["Karnal", "Hisar", "Bhiwani", "Jind", "Rohtak", "Sirsa"],
    "Uttar Pradesh": ["Barabanki", "Hardoi", "Sitapur", "Meerut", "Prayagraj", "Etawah"],
    "Madhya Pradesh": ["Sehore", "Vidisha", "Ujjain", "Dhar", "Chhindwara", "Betul"],
}

STATE_CROPS: dict[StateName, list[str]] = {
    "Punjab": ["Wheat", "Rice", "Cotton"],
    "Haryana": ["Wheat", "Mustard", "Bajra"],
    "Uttar Pradesh": ["Sugarcane", "Wheat", "Paddy"],
    "Madhya Pradesh": ["Soybean", "Wheat", "Gram"],
}


class Farm(BaseModel):
    id: int
    village: str
    state: StateName
    crop_type: str
    NDVI: float = Field(..., ge=0, le=1)
    NDWI: float = Field(..., ge=0, le=1)
    temperature: float
    risk_score: int = Field(..., ge=0, le=100)
    stress_type: StressType


class Advisory(BaseModel):
    farm_id: int
    stress_type: StressType
    risk_score: int
    recommendations: list[str]


class ScanResponse(BaseModel):
    scanned_farms: int
    summary: dict[str, int]
    advisories: list[Advisory]


def evaluate_stress(ndvi: float, ndwi: float, temperature: float) -> StressType:
    if ndvi < LOW_NDVI_THRESHOLD and ndwi < LOW_NDWI_THRESHOLD:
        return "water stress"
    if temperature > HIGH_TEMP_THRESHOLD:
        return "heat stress"
    if ndvi < LOW_NDVI_THRESHOLD and ndwi >= NORMAL_MOISTURE_NDWI_THRESHOLD:
        return "nutrient deficiency"
    return "healthy"


def risk_from_metrics(ndvi: float, ndwi: float, temperature: float, stress_type: StressType) -> int:
    # Weighted heuristic risk score for demo analytics output.
    ndvi_risk = max(0.0, (0.75 - ndvi) / 0.75) * 45
    ndwi_risk = max(0.0, (0.50 - ndwi) / 0.50) * 30
    temp_risk = max(0.0, (temperature - 30.0) / 15.0) * 25
    stress_bonus = {
        "healthy": 0,
        "nutrient deficiency": 8,
        "water stress": 12,
        "heat stress": 10,
    }[stress_type]
    score = int(round(min(100, ndvi_risk + ndwi_risk + temp_risk + stress_bonus)))
    return score


def recommendations_for(stress_type: StressType) -> list[str]:
    if stress_type == "water stress":
        return [
            "Start micro-irrigation cycles in early morning and late evening.",
            "Apply mulch cover to reduce surface evaporation.",
            "Prioritize canal or borewell allocation for this farm cluster.",
        ]
    if stress_type == "heat stress":
        return [
            "Shift irrigation window to cooler hours to reduce canopy heat load.",
            "Use anti-transpirant spray on sensitive growth stages.",
            "Issue district-level heat advisory for field operations.",
        ]
    if stress_type == "nutrient deficiency":
        return [
            "Conduct rapid soil nutrient test for NPK balance.",
            "Apply targeted foliar nutrient spray within 48 hours.",
            "Reassess fertilizer schedule based on crop growth stage.",
        ]
    return [
        "Maintain current irrigation and nutrient schedule.",
        "Continue weekly satellite monitoring for early anomalies.",
    ]


def generate_farms(seed: int = 42) -> list[Farm]:
    random.seed(seed)
    states: list[StateName] = [
        "Punjab",
        "Punjab",
        "Punjab",
        "Punjab",
        "Punjab",
        "Punjab",
        "Punjab",
        "Punjab",
        "Haryana",
        "Haryana",
        "Haryana",
        "Haryana",
        "Haryana",
        "Haryana",
        "Haryana",
        "Haryana",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Uttar Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
        "Madhya Pradesh",
    ]

    farms: list[Farm] = []
    for farm_id, state in enumerate(states, start=1):
        village = random.choice(STATE_VILLAGES[state])
        crop = random.choice(STATE_CROPS[state])

        ndvi = round(random.uniform(0.25, 0.88), 2)
        ndwi = round(random.uniform(0.12, 0.75), 2)
        temperature = round(random.uniform(27.0, 43.0), 1)

        stress = evaluate_stress(ndvi, ndwi, temperature)
        risk = risk_from_metrics(ndvi, ndwi, temperature, stress)

        farms.append(
            Farm(
                id=farm_id,
                village=village,
                state=state,
                crop_type=crop,
                NDVI=ndvi,
                NDWI=ndwi,
                temperature=temperature,
                risk_score=risk,
                stress_type=stress,
            )
        )

    return farms


FARMS_DB: list[Farm] = generate_farms()


@app.get("/farms", response_model=list[Farm])
def get_farms(state: StateName | None = None) -> list[Farm]:
    if state is None:
        return FARMS_DB
    return [farm for farm in FARMS_DB if farm.state == state]


@app.post("/scan", response_model=ScanResponse)
def run_scan() -> ScanResponse:
    advisories: list[Advisory] = []
    summary = {
        "healthy": 0,
        "water stress": 0,
        "heat stress": 0,
        "nutrient deficiency": 0,
    }

    for farm in FARMS_DB:
        stress = evaluate_stress(farm.NDVI, farm.NDWI, farm.temperature)
        farm.stress_type = stress
        farm.risk_score = risk_from_metrics(farm.NDVI, farm.NDWI, farm.temperature, stress)

        summary[stress] += 1
        advisories.append(
            Advisory(
                farm_id=farm.id,
                stress_type=stress,
                risk_score=farm.risk_score,
                recommendations=recommendations_for(stress),
            )
        )

    return ScanResponse(scanned_farms=len(FARMS_DB), summary=summary, advisories=advisories)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "FarmPulse AI", "status": "ok"}
