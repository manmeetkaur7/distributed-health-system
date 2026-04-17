from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(title="AI Risk Service")


class HealthData(BaseModel):
    age: int = Field(..., ge=0)
    heartRate: int = Field(..., ge=0)
    bloodPressure: str
    sleepHours: float = Field(..., ge=0)
    stressLevel: str
    activityLevel: str


def parse_systolic_pressure(blood_pressure: str) -> int | None:
    try:
        return int(blood_pressure.split("/")[0])
    except (ValueError, IndexError):
        return None


def calculate_risk_level(data: HealthData) -> str:
    stress_level = data.stressLevel.lower()
    activity_level = data.activityLevel.lower()
    systolic_pressure = parse_systolic_pressure(data.bloodPressure)

    high_stress = stress_level == "high"
    low_sleep = data.sleepHours < 6
    high_heart_rate = data.heartRate > 100
    high_blood_pressure = systolic_pressure is not None and systolic_pressure >= 140
    low_activity = activity_level == "low"
    older_age = data.age >= 65

    if high_stress and low_sleep and high_heart_rate:
        return "high"

    abnormal_count = sum(
        [
            high_stress,
            low_sleep,
            high_heart_rate,
            high_blood_pressure,
            low_activity,
            older_age,
        ]
    )

    if abnormal_count >= 4:
        return "high"

    if abnormal_count >= 2:
        return "medium"

    return "low"


@app.get("/")
def root():
    return {"message": "AI Risk Service is running"}


@app.post("/predict-risk")
def predict_risk(data: HealthData):
    return {"riskLevel": calculate_risk_level(data)}
