import sys
import os
import json

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

sys.path.append(PROJECT_ROOT)

from src.prediction import (
    predict_patient,
    compare_predictions
)

from src.history import (
    save_prediction,
    load_history
)

# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Heart Disease Predictor",
    page_icon="❤️",
    layout="wide"
)

if "prediction_result" not in st.session_state:
    st.session_state.prediction_result = None

if "patient_data" not in st.session_state:
    st.session_state.patient_data = None
# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title("❤️ Heart Disease AI")

page = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Prediction",
        "🔬 Model Comparison",
        "📜 Prediction History",
        "📄 Generate Report"
    ]
)

st.sidebar.divider()

st.sidebar.caption(
    "Hybrid Classical–Quantum ML Project"
)

st.sidebar.caption(
    "For educational and research purposes only."
)

# ============================================================
# PAGE 1 — PREDICTION
# ============================================================

if page == "🏠 Prediction":

    # ========================================================
    # TITLE
    # ========================================================
    st.title("❤️ Heart Disease Prediction")

    st.write(
        "Enter patient health information to obtain "
        "a machine-learning prediction and model-based "
        "risk estimate."
    )

    st.info(
        "This application is intended for educational "
        "and research purposes. The prediction is not "
        "a medical diagnosis."
    )


    # ========================================================
    # PATIENT INFORMATION
    # ========================================================

    st.header("Patient Information")

    col1, col2 = st.columns(2)


    # ========================================================
    # LEFT COLUMN
    # ========================================================

    with col1:

        # -------------------------
        # Age
        # -------------------------

        age = st.number_input(
            "Age",
            min_value=1,
            max_value=120,
            value=40,
            step=1
        )


        # -------------------------
        # Sex
        # -------------------------

        sex = st.selectbox(
            "Sex",
            options=[
                "Female",
                "Male"
            ]
        )


        # -------------------------
        # Chest Pain
        # -------------------------

        cp_label = st.selectbox(
            "Chest Pain Type",
            options=[
                "Typical Angina",
                "Atypical Angina",
                "Non-anginal Pain",
                "Asymptomatic"
            ]
        )

        cp_mapping = {
            "Typical Angina": 1,
            "Atypical Angina": 2,
            "Non-anginal Pain": 3,
            "Asymptomatic": 4
        }

        cp = cp_mapping[cp_label]


        # -------------------------
        # Resting Blood Pressure
        # -------------------------

        trestbps = st.number_input(
            "Resting Blood Pressure (mmHg)",
            min_value=50,
            max_value=250,
            value=120,
            step=1
        )


        # -------------------------
        # Cholesterol
        # -------------------------

        chol = st.number_input(
            "Cholesterol (mg/dL)",
            min_value=50,
            max_value=700,
            value=200,
            step=1
        )


        # -------------------------
        # Fasting Blood Sugar
        # -------------------------

        fbs_label = st.selectbox(
            "Fasting Blood Sugar > 120 mg/dL",
            options=[
                "No",
                "Yes"
            ]
        )

        fbs = 1 if fbs_label == "Yes" else 0


        # -------------------------
        # Resting ECG
        # -------------------------

        restecg_label = st.selectbox(
            "Resting ECG",
            options=[
                "Normal",
                "ST-T Wave Abnormality",
                "Left Ventricular Hypertrophy"
            ]
        )

        restecg_mapping = {
            "Normal": 0,
            "ST-T Wave Abnormality": 1,
            "Left Ventricular Hypertrophy": 2
        }

        restecg = restecg_mapping[restecg_label]


    # ========================================================
    # RIGHT COLUMN
    # ========================================================

    with col2:

        # -------------------------
        # Maximum Heart Rate
        # -------------------------

        thalach = st.number_input(
            "Maximum Heart Rate",
            min_value=50,
            max_value=250,
            value=150,
            step=1
        )


        # -------------------------
        # Exercise-Induced Angina
        # -------------------------

        exang_label = st.selectbox(
            "Exercise-Induced Angina",
            options=[
                "No",
                "Yes"
            ]
        )

        exang = 1 if exang_label == "Yes" else 0


        # -------------------------
        # ST Depression
        # -------------------------

        oldpeak = st.number_input(
            "ST Depression",
            min_value=0.0,
            max_value=10.0,
            value=1.0,
            step=0.1
        )


        # -------------------------
        # ST Segment Slope
        # -------------------------

        slope_label = st.selectbox(
            "ST Segment Slope",
            options=[
                "Upsloping",
                "Flat",
                "Downsloping"
            ]
        )

        slope_mapping = {
            "Upsloping": 1,
            "Flat": 2,
            "Downsloping": 3
        }

        slope = slope_mapping[slope_label]


        # -------------------------
        # Major Vessels
        # -------------------------

        ca = st.selectbox(
            "Number of Major Vessels",
            options=[
                0,
                1,
                2,
                3
            ]
        )


        # -------------------------
        # Thalassemia
        # -------------------------

        thal_label = st.selectbox(
            "Thalassemia",
            options=[
                "Normal",
                "Fixed Defect",
                "Reversible Defect"
            ]
        )

        thal_mapping = {
            "Normal": 3,
            "Fixed Defect": 6,
            "Reversible Defect": 7
        }

        thal = thal_mapping[thal_label]


    # ========================================================
    # CONVERT UI VALUES TO MODEL FORMAT
    # ========================================================

    sex_value = 1 if sex == "Male" else 0

    patient_data = {
        "age": age,
        "sex": sex_value,
        "cp": cp,
        "trestbps": trestbps,
        "chol": chol,
        "fbs": fbs,
        "restecg": restecg,
        "thalach": thalach,
        "exang": exang,
        "oldpeak": oldpeak,
        "slope": slope,
        "ca": ca,
        "thal": thal
    }


    # ========================================================
    # PREDICTION BUTTON
    # ========================================================

    st.divider()

    if st.button(
        "🔍 Predict Heart Disease Risk",
        type="primary",
        use_container_width=True
    ):
        result = predict_patient(patient_data)

        st.session_state.prediction_result = result
        st.session_state.patient_data = patient_data

        save_prediction(
            patient_data,
            result["prediction"],
            result["probability"],
            result["risk"]
        )


    # ========================================================
    # DISPLAY PREDICTION
    # ========================================================

    if st.session_state.prediction_result is not None:

        result = st.session_state.prediction_result

        prediction = result["prediction"]
        probability = result["probability"]
        risk = result["risk"]

        # ====================================================
        # PREDICTION RESULT
        # ====================================================

        st.header("Prediction Result")

        if prediction == 1:

            st.error(
                "Model prediction: Heart Disease"
            )

        else:

            st.success(
                "Model prediction: No Heart Disease"
            )


        result_col1, result_col2 = st.columns(2)

        with result_col1:

            st.metric(
                "Model Probability",
                f"{probability * 100:.2f}%"
            )

        with result_col2:

            st.metric(
                "Model-Based Risk Level",
                risk
            )


        # ====================================================
        # SHAP EXPLANATION
        # ====================================================

        st.header(
            "🔎 Why did the model make this prediction?"
        )

        explanation = (
            result["explanation"]
            .head(5)
        )

        st.dataframe(
            explanation[
                [
                    "Feature",
                    "Value",
                    "SHAP"
                ]
            ],
            use_container_width=True,
            hide_index=True
        )

        st.caption(
            "SHAP values indicate how features influenced "
            "the model's prediction. They do not establish "
            "causal relationships."
        )


        # ====================================================
        # WHAT-IF ANALYSIS
        # ====================================================

        st.divider()

        st.header("🔄 What-If Analysis")

        st.write(
            "Change selected health parameters and see "
            "how the model's prediction changes."
        )

        original_patient = (
            st.session_state.patient_data
        )

        whatif_col1, whatif_col2 = st.columns(2)

        with whatif_col1:

            whatif_chol = st.number_input(
                "What-If Cholesterol (mg/dL)",
                min_value=50,
                max_value=700,
                value=int(
                    original_patient["chol"]
                ),
                step=1,
                key="whatif_chol"
            )

        with whatif_col2:

            whatif_bp = st.number_input(
                "What-If Blood Pressure (mmHg)",
                min_value=50,
                max_value=250,
                value=int(
                    original_patient["trestbps"]
                ),
                step=1,
                key="whatif_bp"
            )


        # ====================================================
        # WHAT-IF BUTTON
        # ====================================================

        if st.button(
            "🔄 Run What-If Analysis",
            use_container_width=True
        ):

            modified_patient = (
                original_patient.copy()
            )

            modified_patient["chol"] = whatif_chol
            modified_patient["trestbps"] = whatif_bp

            whatif_result = predict_patient(
                modified_patient
            )


            # =================================================
            # ORIGINAL VS WHAT-IF
            # =================================================

            st.subheader(
                "Original vs What-If"
            )

            original_prediction_text = (
                "Heart Disease"
                if prediction == 1
                else "No Heart Disease"
            )

            whatif_prediction_text = (
                "Heart Disease"
                if whatif_result["prediction"] == 1
                else "No Heart Disease"
            )

            comparison = pd.DataFrame({

                "Metric": [
                    "Probability",
                    "Risk Level",
                    "Prediction"
                ],

                "Original": [
                    f"{probability * 100:.2f}%",
                    risk,
                    original_prediction_text
                ],

                "What-If": [
                    f"{whatif_result['probability'] * 100:.2f}%",
                    whatif_result["risk"],
                    whatif_prediction_text
                ]

            })

            st.dataframe(
                comparison,
                use_container_width=True,
                hide_index=True
            )


            # =================================================
            # PROBABILITY CHANGE
            # =================================================

            probability_change = (
                whatif_result["probability"]
                - probability
            )

            if probability_change > 0:

                st.warning(
                    f"Model probability increased by "
                    f"{probability_change * 100:.2f} "
                    f"percentage points."
                )

            elif probability_change < 0:

                st.info(
                    f"Model probability decreased by "
                    f"{abs(probability_change) * 100:.2f} "
                    f"percentage points."
                )

            else:

                st.info(
                    "The model probability did not change."
                )


            # =================================================
            # VALUES CHANGED
            # =================================================

            st.subheader(
                "Values Changed"
            )

            changes_df = pd.DataFrame({

                "Parameter": [
                    "Cholesterol",
                    "Resting Blood Pressure"
                ],

                "Original": [
                    original_patient["chol"],
                    original_patient["trestbps"]
                ],

                "What-If": [
                    whatif_chol,
                    whatif_bp
                ]

            })

            st.dataframe(
                changes_df,
                use_container_width=True,
                hide_index=True
            )


            # =================================================
            # PROBABILITY CHART
            # =================================================

            st.subheader(
                "📊 Probability Comparison"
            )

            probabilities = [
                probability * 100,
                whatif_result["probability"] * 100
            ]

            labels = [
                "Original",
                "What-If"
            ]

            fig, ax = plt.subplots(
                figsize=(7, 4)
            )

            ax.bar(
                labels,
                probabilities
            )

            ax.set_ylabel(
                "Predicted Probability (%)"
            )

            ax.set_title(
                "Original vs What-If Prediction"
            )

            ax.set_ylim(
                0,
                100
            )

            for i, value in enumerate(
                probabilities
            ):

                ax.text(
                    i,
                    value + 2,
                    f"{value:.2f}%",
                    ha="center"
                )

            st.pyplot(fig)

            plt.close(fig)


            # =================================================
            # WHAT-IF SHAP EXPLANATION
            # =================================================

            st.subheader(
                "🔎 What Changed in the Explanation?"
            )

            whatif_explanation = (
                whatif_result["explanation"]
                .head(5)
            )

            st.dataframe(
                whatif_explanation[
                    [
                        "Feature",
                        "Value",
                        "SHAP"
                    ]
                ],
                use_container_width=True,
                hide_index=True
            )

            st.caption(
                "The What-If result shows how the model's "
                "output changes when the selected input "
                "values are modified. It does not represent "
                "a clinical prediction or causal effect."
            )


# ============================================================
# PAGE 2 — MODEL COMPARISON
# ============================================================

elif page == "🔬 Model Comparison":

    st.title("🔬 Model Comparison")

    st.write(
        "Comparison of the classical and quantum machine-learning "
        "models trained for the heart disease prediction project."
    )

    st.info(
        "The values shown below are the evaluation results "
        "obtained from the trained models on their respective "
        "test sets."
    )


    # ========================================================
    # LOAD MODEL METRICS
    # ========================================================

    metrics_path = os.path.join(
        PROJECT_ROOT,
        "models",
        "model_comparison.json"
    )

    if not os.path.exists(metrics_path):

        st.error(
            "model_comparison.json was not found."
        )

        st.code(
            "models/model_comparison.json"
        )

        st.stop()


    try:

        with open(
            metrics_path,
            "r"
        ) as file:

            metrics_data = json.load(file)

    except Exception as e:

        st.error(
            "Unable to read model_comparison.json."
        )

        st.exception(e)

        st.stop()


    models = metrics_data.get(
        "models",
        []
    )

    if not models:

        st.error(
            "No model results were found in "
            "model_comparison.json."
        )

        st.stop()


    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    comparison_df = pd.DataFrame(models)

    comparison_df = comparison_df.rename(
        columns={
            "name": "Model",
            "accuracy": "Accuracy",
            "precision": "Precision",
            "recall": "Recall",
            "f1_score": "F1 Score"
        }
    )


    # ========================================================
    # DISPLAY TABLE
    # ========================================================

    st.subheader("📋 Performance Summary")

    display_df = comparison_df.copy()

    for column in [
        "Accuracy",
        "Precision",
        "Recall",
        "F1 Score"
    ]:

        display_df[column] = (
            display_df[column] * 100
        ).round(2).astype(str) + "%"


    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )


    # ========================================================
    # ACCURACY
    # ========================================================

    st.subheader("📊 Accuracy Comparison")

    fig1, ax1 = plt.subplots(
        figsize=(8, 4)
    )

    accuracy_values = (
        comparison_df["Accuracy"] * 100
    )

    bars = ax1.bar(
        comparison_df["Model"],
        accuracy_values
    )

    ax1.set_ylabel(
        "Accuracy (%)"
    )

    ax1.set_title(
        "Model Accuracy"
    )

    ax1.set_ylim(
        0,
        100
    )

    ax1.tick_params(
        axis="x",
        rotation=15
    )

    for bar, value in zip(
        bars,
        accuracy_values
    ):

        ax1.text(
            bar.get_x() + bar.get_width() / 2,
            value + 2,
            f"{value:.2f}%",
            ha="center"
        )

    st.pyplot(fig1)

    plt.close(fig1)


    # ========================================================
    # ALL METRICS
    # ========================================================

    st.subheader(
        "📈 Accuracy, Precision, Recall & F1 Score"
    )

    metrics_to_plot = [
        "Accuracy",
        "Precision",
        "Recall",
        "F1 Score"
    ]

    fig2, ax2 = plt.subplots(
        figsize=(10, 5)
    )

    x = range(
        len(comparison_df)
    )

    width = 0.18

    for index, metric in enumerate(
        metrics_to_plot
    ):

        values = (
            comparison_df[metric] * 100
        )

        positions = [
            i + (index - 1.5) * width
            for i in x
        ]

        bars = ax2.bar(
            positions,
            values,
            width,
            label=metric
        )

        for bar, value in zip(
            bars,
            values
        ):

            ax2.text(
                bar.get_x()
                + bar.get_width() / 2,
                value + 1,
                f"{value:.1f}",
                ha="center",
                fontsize=8
            )


    ax2.set_xticks(
        list(x)
    )

    ax2.set_xticklabels(
        comparison_df["Model"],
        rotation=15
    )

    ax2.set_ylabel(
        "Score (%)"
    )

    ax2.set_ylim(
        0,
        100
    )

    ax2.set_title(
        "Model Performance Comparison"
    )

    ax2.legend()

    st.pyplot(fig2)

    plt.close(fig2)


    # ========================================================
    # MODEL INFORMATION
    # ========================================================

    st.divider()

    st.subheader(
        "🧠 Models Used in This Project"
    )


    model_col1, model_col2, model_col3 = st.columns(3)


    # --------------------------------------------------------
    # RANDOM FOREST
    # --------------------------------------------------------

    with model_col1:

        st.markdown(
            "### 🌲 Random Forest"
        )

        st.write(
            "A classical ensemble machine-learning model "
            "that combines multiple decision trees to make "
            "a prediction."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[0]['Accuracy'] * 100:.2f}%"
        )


    # --------------------------------------------------------
    # SVM
    # --------------------------------------------------------

    with model_col2:

        st.markdown(
            "### 📐 SVM"
        )

        st.write(
            "A classical Support Vector Machine model that "
            "separates classes using a decision boundary."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[1]['Accuracy'] * 100:.2f}%"
        )


    # --------------------------------------------------------
    # QUANTUM SVM
    # --------------------------------------------------------

    with model_col3:

        st.markdown(
            "### ⚛️ Quantum SVM"
        )

        st.write(
            "A quantum machine-learning approach using "
            "a quantum feature map and quantum kernel "
            "to perform classification."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[2]['Accuracy'] * 100:.2f}%"
        )


    # ========================================================
    # PROJECT ARCHITECTURE NOTE
    # ========================================================

    st.divider()

    st.subheader(
        "🏗️ Role of Each Model"
    )

    st.markdown(
        """
        **Random Forest**
        
        Used as the primary prediction model in the application.
        It also provides the SHAP-based explanation shown on the
        prediction page.

        **SVM**
        
        Used as a classical machine-learning comparison model.

        **Quantum SVM (QSVC)**
        
        Used as the quantum machine-learning comparison model.
        Its results demonstrate the performance of the quantum
        classification pipeline used in this project.
        """
    )


    # ========================================================
    # IMPORTANT INTERPRETATION
    # ========================================================

    st.warning(
        "The model scores describe performance on the test data "
        "used during this project. They should not be interpreted "
        "as clinical accuracy or as evidence that one algorithm "
        "is universally better than another."
    )
# ==================================
# Prediction History Page
# ==================================

elif page == "📜 Prediction History":

    st.title("📜 Prediction History")

    history_df = load_history()

    if history_df.empty:

        st.warning(
            "No prediction history available."
        )

    else:

        st.metric(
            "Total Predictions",
            len(history_df)
        )

        st.subheader(
            "Risk Distribution"
        )

        risk_counts = (
            history_df["Risk"]
            .value_counts()
        )

        st.bar_chart(
            risk_counts
        )

        st.subheader(
            "Prediction Records"
        )

        st.dataframe(
            history_df,
            use_container_width=True
        )

        st.download_button(
            label="⬇ Download History",
            data=history_df.to_csv(
                index=False
            ),
            file_name="prediction_history.csv",
            mime="text/csv"
        )
elif page == "📄 Generate Report":

    st.title("📄 Generate Prediction Report")

    if (
        st.session_state.prediction_result is None
    ):

        st.warning(
            "Please generate a prediction first."
        )

    else:

        from src.report_generator import (
            generate_report
        )

        patient_data = (
            st.session_state.patient_data
        )

        prediction_result = (
            st.session_state.prediction_result
        )

        model_metrics = [
            ["Random Forest", "86.67%"],
            ["SVM", "85.00%"],
            ["Quantum SVM", "66.67%"]
        ]

        output_file = os.path.join(
            PROJECT_ROOT,
            "heart_report.pdf"
        )

        generate_report(
            patient_data,
            prediction_result,
            model_metrics,
            output_file
        )

        with open(
            output_file,
            "rb"
        ) as pdf:

            st.download_button(
                label="⬇ Download PDF Report",
                data=pdf,
                file_name="Heart_Disease_Report.pdf",
                mime="application/pdf"
            )

        st.success(
            "Report ready for download."
        )