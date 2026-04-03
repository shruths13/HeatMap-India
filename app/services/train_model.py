import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
import pickle

def generate_synthetic_data(n=1000):
    np.random.seed(42)
    
    # 8 distinct signals
    land_surface_temp = np.random.normal(35, 5, n)
    air_temp = np.random.normal(32, 4, n)
    humidity = np.random.normal(60, 15, n)
    uv_index = np.random.uniform(5, 12, n)
    green_cover_pct = np.random.uniform(5, 45, n)
    concrete_density = np.random.uniform(30, 95, n)
    population_density = np.random.normal(25000, 10000, n)
    citizen_reports = np.random.poisson(lam=5, size=n)
    
    # Ground truth formula for generating targets for the Random Forest to learn
    # High temps + high concrete + high population/reports = High Risk
    # High green cover = Reduces Risk
    target = (
        3.0 
        + (land_surface_temp - 30) * 0.2
        + (air_temp - 30) * 0.15
        + (uv_index - 7) * 0.1
        + (humidity - 50) * 0.05
        + (concrete_density - 50) * 0.03
        + (citizen_reports * 0.05)
        - (green_cover_pct * 0.06)
    )
    
    # Clamp score between 1 and 10 and add a little noise
    target = target + np.random.normal(0, 0.5, n)
    target = np.clip(target, 1.0, 10.0)
    
    df = pd.DataFrame({
        "land_surface_temp": land_surface_temp,
        "air_temp": air_temp,
        "humidity": humidity,
        "uv_index": uv_index,
        "green_cover_pct": green_cover_pct,
        "concrete_density": concrete_density,
        "population_density": population_density,
        "citizen_reports": citizen_reports,
        "ward_score": target
    })
    
    return df

def train_and_save():
    print("Generating 1,000 synthetic ward records...")
    df = generate_synthetic_data()
    
    features = [
        "land_surface_temp", "air_temp", "humidity", "uv_index", 
        "green_cover_pct", "concrete_density", "population_density", "citizen_reports"
    ]
    X = df[features]
    y = df["ward_score"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Training RandomForestRegressor model...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X_train_scaled, y_train)
    
    preds = rf.predict(X_test_scaled)
    r2 = r2_score(y_test, preds)
    print(f"Validation R2 Score: {r2:.3f}")
    assert r2 > 0.82, "R2 target not met, model needs tuning!"
    
    # Save the artifacts into app/models
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "ward_rf_model.pkl")
    scaler_path = os.path.join(models_dir, "ward_scaler.pkl")
    
    with open(model_path, "wb") as f:
        pickle.dump(rf, f)
        
    with open(scaler_path, "wb") as f:
        pickle.dump(scaler, f)
        
    print(f"Saved highly-performant ward ML Model to {model_path}!")

if __name__ == "__main__":
    train_and_save()