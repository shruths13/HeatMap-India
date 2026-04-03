from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ReportIssue(BaseModel):
    description: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    image_url: Optional[str] = None

@router.post("/api/v1/report")
async def report_issue(report: ReportIssue):
    # Safe hackathon mock - normally we'd save this to a Postgres database
    print(f"Received Heat Risk Report: {report.description} at {report.lat}, {report.lon}")
    
    return {
        "status": "success",
        "message": "Report logged successfully. Thank you for your contribution!",
        "report_id": 999
    }
