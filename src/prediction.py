import joblib
import pandas as pd
import shap
from pathlib import Path


# -----------------------------
# Load trained model
# -----------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "random_forest.pkl"

rf_model = joblib.load(MODEL_PATH)


# -----------------------------
# Feature names
# -----------------------------

FEATURE_NAMES = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest Pain Type",
    "trestbps": "Resting Blood Pressure",
    "chol": "Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting ECG",
    "thalach": "Maximum Heart Rate",
    "exang": "Exercise-Induced Angina",
    "oldpeak": "ST Depression",
    "slope": "ST Segment Slope",
    "ca": "Major Vessels",
    "thal": "Thalassemia"
}


# -----------------------------
# Risk classification
# -----------------------------

def get_risk_level(probability):

    if probability < 0.40:
        return "Low"

    elif probability < 0.70:
        return "Medium"

    return "High"


# -----------------------------
# Model prediction
# -----------------------------

def predict_patient(patient_data):

    missing_features = set(rf_model.feature_names_in_) - set(patient_data)
    if missing_features:
        raise ValueError(
            "Missing model features: "
            + ", ".join(sorted(missing_features))
        )

    patient_df = pd.DataFrame(
        [patient_data]
    )

    # Make sure feature order is exactly
    # the same as during training
    patient_df = patient_df[rf_model.feature_names_in_]

    prediction = rf_model.predict(
        patient_df
    )[0]

    probability = rf_model.predict_proba(
        patient_df
    )[0][1]

    risk = get_risk_level(
        probability
    )

    # SHAP explanation
    explainer = shap.TreeExplainer(
        rf_model
    )

    shap_explanation = explainer(
        patient_df
    )

    shap_values = shap_explanation.values[0]
    if shap_values.ndim == 2:
        shap_values = shap_values[:, 1]

    explanation_df = pd.DataFrame({
        "Feature": patient_df.columns,
        "Value": patient_df.iloc[0].values,
        "SHAP": shap_values
    })

    explanation_df["Absolute_SHAP"] = (
        explanation_df["SHAP"].abs()
    )

    explanation_df = explanation_df.sort_values(
        "Absolute_SHAP",
        ascending=False
    )

    explanation_df["Feature"] = (
        explanation_df["Feature"]
        .map(FEATURE_NAMES)
    )

    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "risk": risk,
        "explanation": explanation_df
    }
    
def what_if_prediction(original_patient, changes):

    modified_patient = original_patient.copy()

    for feature, new_value in changes.items():
        modified_patient[feature] = new_value

    result = predict_patient(modified_patient)

    return result

def compare_predictions(original_patient, changes):

    original_result = predict_patient(
        original_patient
    )

    what_if_result = what_if_prediction(
        original_patient,
        changes
    )

    return original_result, what_if_result