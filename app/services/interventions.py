def get_interventions(ward: dict) -> list:
    score = float(ward.get("score", 5.0))
    green = float(ward.get("green_cover_pct", 20.0))
    concrete = float(ward.get("concrete_density", 60.0))

    recs = []

    # 1. 🌳 Tree planting / Green Roofs
    if green < 20:
        trees = int(max((20 - green) * 10, 50))
        recs.append({
            "name": f"Plant {trees} Trees & Green Roofs",
            "description": "Increase canopy cover in dense residential blocks.",
            "cost": f"₹{trees * 2000}",
            "cooling": round(trees * 0.015, 1),
            "timeline": "Medium Term"
        })

    # 2. 🏠 Reflective Pavements & Cool Roofs
    if concrete > 65:
        recs.append({
            "name": "Reflective Pavements & Cool Roofs",
            "description": "Paint roofs white and re-pave roads with high albedo materials.",
            "cost": "₹3.5L",
            "cooling": 1.8,
            "timeline": "Short Term"
        })

    # 3. 🚿 Emergency Cooling Centers
    if score >= 7:
        recs.append({
            "name": "Deploy Emergency Cooling Centers",
            "description": "Set up immediate air-conditioned shelters and misting fans in public areas.",
            "cost": "₹1.5L",
            "cooling": 3.0,
            "timeline": "Immediate"
        })
        
    # 4. 🚨 Danger Evacuation & Alerts
    if score >= 9:
        recs.append({
            "name": "Red Alert Protocols & Evacuation",
            "description": "Trigger SMS push warnings to citizens, mandate outdoor work bans 12-4PM.",
            "cost": "₹50K",
            "cooling": 0.0,
            "timeline": "Immediate"
        })

    # Always ensure we return at least a generic recommendation if nothing triggered
    if not recs:
        recs.append({
            "name": "Community Awareness Campaign",
            "description": "Educate citizens on heatstroke prevention and hydration.",
            "cost": "₹20K",
            "cooling": 0.0,
            "timeline": "Short Term"
        })

    return recs[:4]