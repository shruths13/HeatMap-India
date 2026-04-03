def get_interventions(ward: dict) -> list:

    score = ward.get("score", 5)
    green = ward.get("green_cover_pct", 20)
    concrete = ward.get("concrete_density", 60)

    recs = []

    # 🌳 Tree planting
    if green < 15:
        trees = int((20 - green) * 10)
        recs.append({
            "name": f"Plant {trees} trees",
            "cost": f"₹{trees * 2000}",
            "cooling": round(trees * 0.01, 1)
        })

    # 🏠 Cool roofs
    if concrete > 70:
        recs.append({
            "name": "Cool Roof Installation",
            "cost": "₹2L",
            "cooling": 1.5
        })

    # 🚿 Emergency cooling
    if score >= 8:
        recs.append({
            "name": "Install Cooling Stations",
            "cost": "₹1.5L",
            "cooling": 2.0
        })

    return recs[:3]