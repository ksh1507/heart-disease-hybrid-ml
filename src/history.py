import pandas as pd
from datetime import datetime
from pathlib import Path


HISTORY_FILE = Path(__file__).resolve().parents[1] / "data" / "prediction_history.csv"


def save_prediction(
    patient_data,
    prediction,
    probability,
    risk,
    patient_id=None,
    patient_name=None,
    timestamp=None,
):
    """
    Save prediction to CSV history.
    """

    record = {
        "Timestamp": timestamp or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "PatientID": patient_id or "",
        "PatientName": patient_name or "Anonymous Patient",
        "Age": patient_data["age"],
        "Sex": "Male"
        if patient_data["sex"] == 1
        else "Female",
        "Prediction": (
            "Heart Disease"
            if prediction == 1
            else "No Heart Disease"
        ),
        "Probability": round(
            probability * 100,
            2
        ),
        "Risk": risk,
        "BloodPressure": patient_data["trestbps"],
        "Cholesterol": patient_data["chol"],
        "KeyFactor": "",
    }

    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)

    if HISTORY_FILE.exists():
        existing = pd.read_csv(HISTORY_FILE)
        df = pd.concat([existing, pd.DataFrame([record])], ignore_index=True)
    else:
        df = pd.DataFrame([record])

    df.to_csv(HISTORY_FILE, index=False)


def load_history():

    if HISTORY_FILE.exists():
        return pd.read_csv(HISTORY_FILE)

    return pd.DataFrame()