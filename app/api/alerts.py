from fastapi import APIRouter
from app.models.ward_score import compute_ward_score
from app.services.nasa import get_thermal_data
from app.services.weather import get_weather

router = APIRouter()

DEMO_WARDS = {
    "chennai": [
        {
            "name": "T Nagar",
            "lat": 13.04,
            "lon": 80.23,
            "green_cover_pct": 10,
            "concrete_density": 80
        }
    ]
}

@router.get("/api/v1/alerts/{city}")
async def get_alerts(city: str):

    wards = DEMO_WARDS.get(city.lower(), DEMO_WARDS["chennai"])
    alerts = []

    for ward in wards:
        thermal = await get_thermal_data(ward["lat"], ward["lon"])
        weather = await get_weather(ward["lat"], ward["lon"])

        score_data = compute_ward_score({
            "land_surface_temp": thermal["lst"],
            "air_temp": weather["temp"],
            "green_cover_pct": ward["green_cover_pct"],
            "concrete_density": ward["concrete_density"]
        })

        if score_data["score"] >= 8:
            alerts.append({
                "ward": ward["name"],
                "message": "⚠ High heat risk! Avoid outdoor activity 12–4 PM."
            })

    return alerts