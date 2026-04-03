from fastapi import APIRouter
from app.services.nasa import get_thermal_data
from app.services.weather import get_weather
from app.models.ward_score import compute_ward_score 
from app.services.interventions import get_interventions

router = APIRouter()

# same mock data (keep consistent)
DEMO_WARDS = {
    "1": {
        "id": "1",
        "name": "T Nagar",
        "lat": 13.04,
        "lon": 80.23,
        "green_cover_pct": 10,
        "concrete_density": 80,
        "population_density": 20000
    }
}

@router.get("/api/v1/ward/{ward_id}")
async def get_ward_detail(ward_id: str):

    ward = DEMO_WARDS.get(ward_id)

    if not ward:
        return {"error": "Ward not found"}

    thermal = await get_thermal_data(ward["lat"], ward["lon"])
    weather = await get_weather(ward["lat"], ward["lon"])

    score_data = compute_ward_score({
        "land_surface_temp": thermal["lst"],
        "air_temp": weather["temp"],
        "green_cover_pct": ward["green_cover_pct"],
        "concrete_density": ward["concrete_density"]
    })

    return {
        "name": ward["name"],
        "score": score_data["score"],
        "risk": score_data["risk"],
        "air_temp": weather["temp"],
        "feels_like": weather["feels_like"],
        "humidity": weather["humidity"],
        "interventions": get_interventions({
    "score": score_data["score"],
    "green_cover_pct": ward["green_cover_pct"],
    "concrete_density": ward["concrete_density"]
})  # next step
    }