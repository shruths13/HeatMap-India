import os
import pickle
import numpy as np

# Cache instances
_MODEL = None
_SCALER = None

def _load_ml_artifacts():
    global _MODEL, _SCALER
    if _MODEL is not None and _SCALER is not None:
        return True
    
    try:
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, "ward_rf_model.pkl")
        scaler_path = os.path.join(base_dir, "ward_scaler.pkl")
        
        with open(model_path, "rb") as f:
            _MODEL = pickle.load(f)
        with open(scaler_path, "rb") as f:
            _SCALER = pickle.load(f)
        return True
    except Exception:
        return False

def compute_ward_score(ward_data: dict) -> dict:
    # Safely extract all required 8 metrics with defaults
    lst  = float(ward_data.get("land_surface_temp", 40))
    air  = float(ward_data.get("air_temp", 35))
    hum  = float(ward_data.get("humidity", 50))
    uvi  = float(ward_data.get("uv_index", 7))
    grn  = float(ward_data.get("green_cover_pct", 20))
    con  = float(ward_data.get("concrete_density", 60))
    pop  = float(ward_data.get("population_density", 15000))
    cit  = float(ward_data.get("citizen_reports", 2))
    
    score = None
    ai_active = False

    # 🚀 Attempt ML Inference
    if _load_ml_artifacts():
        try:
            # Must strictly match sequence in train_model
            features = np.array([[lst, air, hum, uvi, grn, con, pop, cit]])
            X_scaled = _SCALER.transform(features)
            raw = _MODEL.predict(X_scaled)[0]
            score = round(min(max(float(raw), 1.0), 10.0), 1)
            ai_active = True
        except Exception:
            score = None

    # 🛡️ Deterministic Edge (Fallback path if missing PKL or crash)
    if score is None:
        raw = 3.0 + (lst-30)*0.25 + (air-30)*0.15 - grn*0.04 + con*0.02
        score = round(min(max(float(raw), 1.0), 10.0), 1)
        ai_active = False

    risk = (
        "DANGER" if score >= 9 else
        "HIGH" if score >= 7 else
        "MODERATE" if score >= 5 else
        "LOW" if score >= 3 else
        "SAFE"
    )

    return {
        "score": score,
        "risk": risk,
        "ai_active": ai_active
    }