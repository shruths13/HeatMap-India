from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv
import os
from fastapi import FastAPI

from app.services.nasa import get_thermal_data 
from app.api.heatmap import router as heatmap_router
from app.api.ward import router as ward_router 
from app.api.alerts import router as alerts_router

load_dotenv()

app = FastAPI()   # 🔴 THIS MUST COME BEFORE ANY @app 
origins = [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app"
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

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/test-nasa")
async def test_nasa():
    return await get_thermal_data(13.08, 80.27)
from app.services.weather import get_weather

@app.get("/test-weather")
async def test_weather():
    return await get_weather(13.08, 80.27)
from app.api.heatmap import router as heatmap_router

app.include_router(heatmap_router)