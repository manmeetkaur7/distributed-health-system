from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional


app = FastAPI(title="AI Risk Service")


class HealthData(BaseModel):
    age: int = Field(..., ge=0)
    heartRate: int = Field(..., ge=0)
    bloodPressure: str
    symptoms: Optional[str] = None
    heightCm: Optional[float] = Field(default=None, ge=0)
    weightKg: Optional[float] = Field(default=None, ge=0)
    oxygenLevel: Optional[float] = Field(default=None, ge=0)
    bodyTemperature: Optional[float] = Field(default=None, ge=0)
    bloodSugar: Optional[float] = Field(default=None, ge=0)
    cholesterol: Optional[float] = Field(default=None, ge=0)
    sleepHours: float = Field(..., ge=0)
    stressLevel: str
    activityLevel: str
    smokingStatus: Optional[str] = None
    alcoholUse: Optional[str] = None


def parse_systolic_pressure(blood_pressure: str) -> int | None:
    try:
        return int(blood_pressure.split("/")[0])
    except (ValueError, IndexError):
        return None


def calculate_risk_level(data: HealthData) -> str:
    stress_level = data.stressLevel.lower()
    activity_level = data.activityLevel.lower()
    smoking_status = (data.smokingStatus or "").lower()
    alcohol_use = (data.alcoholUse or "").lower()
    systolic_pressure = parse_systolic_pressure(data.bloodPressure)

    high_stress = stress_level == "high"
    low_sleep = data.sleepHours < 6
    high_heart_rate = data.heartRate > 100
    high_blood_pressure = systolic_pressure is not None and systolic_pressure >= 140
    low_oxygen = data.oxygenLevel is not None and data.oxygenLevel < 94
    fever = data.bodyTemperature is not None and data.bodyTemperature >= 100.4
    high_blood_sugar = data.bloodSugar is not None and data.bloodSugar >= 180
    high_cholesterol = data.cholesterol is not None and data.cholesterol >= 240
    low_activity = activity_level == "low"
    smoker = smoking_status in ["current", "yes"]
    frequent_alcohol = alcohol_use in ["frequent", "high"]
    older_age = data.age >= 65

    if high_stress and low_sleep and high_heart_rate:
        return "high"

    if low_oxygen and (high_heart_rate or fever):
        return "high"

    abnormal_count = sum(
        [
            high_stress,
            low_sleep,
            high_heart_rate,
            high_blood_pressure,
            low_oxygen,
            fever,
            high_blood_sugar,
            high_cholesterol,
            low_activity,
            smoker,
            frequent_alcohol,
            older_age,
        ]
    )

    if abnormal_count >= 4:
        return "high"

    if abnormal_count >= 2:
        return "medium"

    return "low"


def analyze_health_data(data: HealthData) -> dict:
    stress_level = data.stressLevel.lower()
    activity_level = data.activityLevel.lower()
    smoking_status = (data.smokingStatus or "").lower()
    alcohol_use = (data.alcoholUse or "").lower()
    symptoms = (data.symptoms or "").strip()
    symptom_text = symptoms.lower()
    systolic_pressure = parse_systolic_pressure(data.bloodPressure)

    reasons = []
    suggestions = []
    possible_concerns = []
    recommended_tests = []
    emergency_flags = []

    if data.heartRate > 250:
        emergency_flags.append("Heart rate is outside a realistic safe range. Recheck the value immediately.")
        possible_concerns.append("Possible measurement error or serious heart rhythm problem")
        suggestions.append("If this reading is real or you have chest pain, fainting, severe weakness, or trouble breathing, seek emergency care.")
    elif data.heartRate >= 130:
        reasons.append("Heart rate is very high.")
        possible_concerns.append("Tachycardia or acute stress response")
        suggestions.append("Rest, hydrate, avoid caffeine, and recheck your pulse. Contact a clinician if it stays high.")
    elif data.heartRate > 100:
        reasons.append("Heart rate is above the usual resting range.")
        possible_concerns.append("Tachycardia, stress, dehydration, fever, or stimulant effect")
        suggestions.append("Recheck after resting for 5 to 10 minutes and track whether it remains elevated.")
    elif data.heartRate < 40:
        reasons.append("Heart rate is unusually low.")
        possible_concerns.append("Bradycardia or medication-related low pulse")
        suggestions.append("Contact a clinician if this is new, symptomatic, or not normal for you.")

    if systolic_pressure is not None and systolic_pressure >= 180:
        emergency_flags.append("Systolic blood pressure is in a severe range.")
        possible_concerns.append("Severe hypertension")
        suggestions.append("Recheck blood pressure. Seek urgent care if it remains very high or symptoms are present.")
    elif systolic_pressure is not None and systolic_pressure >= 140:
        reasons.append("Blood pressure is high.")
        possible_concerns.append("Hypertension risk")
        suggestions.append("Limit sodium, stay active, reduce stress, and discuss repeated high readings with a clinician.")

    if data.oxygenLevel is not None and data.oxygenLevel < 90:
        emergency_flags.append("Oxygen level is very low.")
        possible_concerns.append("Low blood oxygen")
        suggestions.append("Seek urgent medical help if the reading is accurate, especially with shortness of breath.")
    elif data.oxygenLevel is not None and data.oxygenLevel < 94:
        reasons.append("Oxygen level is lower than expected.")
        possible_concerns.append("Respiratory illness or oxygenation problem")
        suggestions.append("Recheck with a reliable pulse oximeter and contact a clinician if it stays low.")

    if data.bodyTemperature is not None and data.bodyTemperature >= 100.4:
        reasons.append("Body temperature suggests fever.")
        possible_concerns.append("Infection or inflammation")
        suggestions.append("Rest, drink fluids, and monitor symptoms. Contact a clinician if fever persists or worsens.")

    if symptoms:
        reasons.append(f"Symptoms reported: {symptoms}.")

        if any(keyword in symptom_text for keyword in ["chest pain", "shortness of breath", "fainting"]):
            emergency_flags.append("Reported symptoms may need urgent medical attention.")
            possible_concerns.append("Symptoms associated with a possible urgent cardiopulmonary problem")
            suggestions.append("Seek urgent medical care if these symptoms are current or worsening.")
        elif any(keyword in symptom_text for keyword in ["cough", "wheeze", "breathing"]):
            possible_concerns.append("Respiratory symptoms")
            suggestions.append("Monitor breathing symptoms closely and contact a clinician if they worsen.")

    if data.bloodSugar is not None and data.bloodSugar >= 200:
        reasons.append("Blood sugar is very high.")
        possible_concerns.append("Possible diabetes or poor glucose control")
        recommended_tests.extend(["A1C test", "Fasting blood glucose", "Oral glucose tolerance test"])
        suggestions.append("Reduce sugary drinks, choose balanced meals, and discuss repeated high readings with a clinician.")
    elif data.bloodSugar is not None and data.bloodSugar >= 140:
        reasons.append("Blood sugar is elevated.")
        possible_concerns.append("Prediabetes or glucose regulation issue")
        recommended_tests.extend(["A1C test", "Fasting blood glucose"])
        suggestions.append("Track readings and consider a blood sugar screening test.")

    if data.cholesterol is not None and data.cholesterol >= 240:
        reasons.append("Cholesterol is high.")
        possible_concerns.append("High cholesterol and cardiovascular risk")
        recommended_tests.append("Lipid panel")
        suggestions.append("Focus on fiber-rich foods, regular activity, and discussing cholesterol management with a clinician.")
    elif data.cholesterol is not None and data.cholesterol >= 200:
        reasons.append("Cholesterol is borderline high.")
        possible_concerns.append("Possible cholesterol imbalance")
        recommended_tests.append("Lipid panel")
        suggestions.append("Consider a complete cholesterol blood test if you have not had one recently.")

    if data.sleepHours < 6:
        reasons.append("Sleep hours are low.")
        possible_concerns.append("Sleep deprivation and stress-related risk")
        suggestions.append("Aim for a consistent sleep schedule and reduce screens/caffeine close to bedtime.")

    if stress_level == "high":
        reasons.append("Stress level is high.")
        possible_concerns.append("Stress-related cardiovascular and sleep impact")
        suggestions.append("Try breathing exercises, short walks, and reducing avoidable stressors.")

    if activity_level == "low":
        reasons.append("Activity level is low.")
        possible_concerns.append("Higher long-term metabolic and cardiovascular risk")
        suggestions.append("Start with short daily walks and increase activity gradually.")

    if smoking_status == "current":
        reasons.append("Current smoking increases health risk.")
        possible_concerns.append("Heart, lung, and circulation disease risk")
        suggestions.append("Consider a smoking cessation plan or support program.")

    if alcohol_use == "frequent":
        reasons.append("Frequent alcohol use can increase health risk.")
        possible_concerns.append("Blood pressure, liver, sleep, and metabolic health impact")
        suggestions.append("Reduce alcohol intake and discuss safe limits with a clinician.")
        recommended_tests.append("Liver function blood test")

    if data.age >= 65:
        reasons.append("Age increases baseline health risk.")
        suggestions.append("Keep regular preventive visits and screenings.")

    if data.weightKg and data.heightCm:
        height_m = data.heightCm / 100
        bmi = data.weightKg / (height_m * height_m)
        if bmi >= 30:
            reasons.append("BMI is in an obesity range.")
            possible_concerns.append("Higher diabetes, blood pressure, and cholesterol risk")
            recommended_tests.extend(["A1C test", "Lipid panel"])
            suggestions.append("Consider a nutrition and activity plan with clinician guidance.")

    risk_level = calculate_risk_level(data)

    if emergency_flags:
        risk_level = "high"
        reasons = emergency_flags + reasons

    if not reasons:
        reasons.append("Submitted values are within the simple rule-based low-risk range.")
        suggestions.append("Keep tracking your readings and maintain healthy habits.")

    return {
        "riskLevel": risk_level,
        "reasons": list(dict.fromkeys(reasons)),
        "suggestions": list(dict.fromkeys(suggestions)),
        "aiRecommendations": list(dict.fromkeys(suggestions)),
        "possibleConcerns": list(dict.fromkeys(possible_concerns)),
        "recommendedTests": list(dict.fromkeys(recommended_tests)),
    }


@app.get("/")
def root():
    return {"message": "AI Risk Service is running"}


@app.post("/predict-risk")
def predict_risk(data: HealthData):
    return analyze_health_data(data)
