import httpx
import os

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

async def get_weather(lat: float, lon: float):
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()

        return {
            "temp": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "uvi": 5  # ⚠️ placeholder (UV needs different API, skip for hackathon)
        }

    except Exception as e:
        print("WEATHER ERROR:", e)
        return {
            "temp": 35,
            "feels_like": 40,
            "humidity": 60,
            "uvi": 5
        }