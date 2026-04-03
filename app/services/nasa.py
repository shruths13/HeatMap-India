import httpx
import os

NASA_API_KEY = os.getenv("NASA_API_KEY")

async def get_thermal_data(lat: float, lon: float):
    url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"

    params = {
        "key": NASA_API_KEY,
        "bbox": f"{lon-0.1},{lat-0.1},{lon+0.1},{lat+0.1}",
        "product": "MODIS_NRT",
        "date": "1"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.text

        # 🚨 Hackathon simplification
        # We just return dummy LST if parsing fails
        if not data:
            return {"lst": 40.0}

        return {"lst": 42.5}  # placeholder for now

    except Exception as e:
        print("NASA ERROR:", e)
        return {"lst": 40.0}