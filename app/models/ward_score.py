def compute_ward_score(ward_data: dict) -> dict:

    lst  = ward_data.get("land_surface_temp", 40)
    air  = ward_data.get("air_temp", 35)
    grn  = ward_data.get("green_cover_pct", 20)
    con  = ward_data.get("concrete_density", 60)

    # 🔥 simple rule-based scoring (hackathon safe)
    raw = 3.0 + (lst-30)*0.25 + (air-30)*0.15 - grn*0.04 + con*0.02

    score = round(min(max(float(raw), 1.0), 10.0), 1)

    risk = (
        "DANGER" if score >= 9 else
        "HIGH" if score >= 7 else
        "MODERATE" if score >= 5 else
        "LOW" if score >= 3 else
        "SAFE"
    )

    return {
        "score": score,
        "risk": risk
    }