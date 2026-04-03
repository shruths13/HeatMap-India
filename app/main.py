import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv

from app.services.nasa import get_thermal_data 
from app.services.weather import get_weather
from app.api.heatmap import router as heatmap_router
from app.api.ward import router as ward_router 
from app.api.alerts import router as alerts_router
from app.api.report import router as report_router

load_dotenv()

app = FastAPI(title="HeatMap India API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app",
    "*" # Allow all for local cross-device hackathon testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(heatmap_router)
app.include_router(ward_router) 
app.include_router(alerts_router)
app.include_router(report_router)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/test-nasa")
async def test_nasa():
    return await get_thermal_data(13.08, 80.27)

@app.get("/test-weather")
async def test_weather():
    return await get_weather(13.08, 80.27)