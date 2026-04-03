from fastapi import APIRouter
from app.models.ward_score import compute_ward_score
from app.services.nasa import get_thermal_data
from app.services.weather import get_weather
import time

CACHE = {}
TTL = 1800  # 30 minutes

router = APIRouter()

# 🚨 Temporary mock wards (we'll replace later with DB)
DEMO_WARDS = {
    "chennai": [
        {
            "name": "T Nagar",
            "lat": 13.04,
            "lon": 80.23,
            "green_cover_pct": 10,
            "concrete_density": 80,
            "population_density": 20000,
            "geometry": [[[80.22,13.03],[80.24,13.03],[80.24,13.05],[80.22,13.05],[80.22,13.03]]]
        }
    ]
}

@router.get("/api/v1/heatmap/{city}")
async def get_heatmap(city: str):

    key = f"heatmap:{city}"

    # 🔥 Cache check
    if key in CACHE and time.time() - CACHE[key]["ts"] < TTL:
        return CACHE[key]["data"]

    wards = DEMO_WARDS.get(city.lower(), DEMO_WARDS["chennai"])
    features = []

    for ward in wards:
        thermal = await get_thermal_data(ward["lat"], ward["lon"])
        weather = await get_weather(ward["lat"], ward["lon"])

        score_data = compute_ward_score({
    "land_surface_temp": thermal["lst"],
    "air_temp": weather["temp"],
    "green_cover_pct": ward["green_cover_pct"],
    "concrete_density": ward["concrete_density"]
})

        feature = {
            "type": "Feature",
            "properties": {
    "name": ward["name"],
    "score": score_data["score"],
    "risk": score_data["risk"],
    "air_temp": weather["temp"],
    "humidity": weather["humidity"]
},
            "geometry": {
                "type": "Polygon",
                "coordinates": ward["geometry"]
            }
        }

        features.append(feature)

    result = {
        "type": "FeatureCollection",
        "features": features
    }

    # 🔥 Save cache
    CACHE[key] = {
        "data": result,
        "ts": time.time()
    }

    return result