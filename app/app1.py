# ============================================================
# IMPORTS
# ============================================================

import sys
import os
import json

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt


# ============================================================
# PROJECT ROOT
# ============================================================

PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

sys.path.append(PROJECT_ROOT)


# ============================================================
# IMPORT PROJECT MODULES
# ============================================================

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


# ============================================================
# SESSION STATE
# ============================================================

if "prediction_result" not in st.session_state:
    st.session_state.prediction_result = None

if "patient_data" not in st.session_state:
    st.session_state.patient_data = None


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title("❤️ Heart Disease AI")

st.sidebar.markdown(
    """
    Hybrid Classical–Quantum
    Machine Learning System
    """
)

st.sidebar.divider()


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

st.sidebar.info(
    """
    Final Year Project
    
    Features:
    
    • Heart Disease Prediction
    
    • Risk Classification
    
    • SHAP Explainability
    
    • What-If Analysis
    
    • Model Comparison
    
    • Prediction History
    
    • PDF Report Generation
    """
)

st.sidebar.caption(
    "For educational and research purposes only."
)


# ============================================================
# PAGE 1 — PREDICTION
# ============================================================

if page == "🏠 Prediction":

    st.title(
        "❤️ Heart Disease Prediction System"
    )

    st.write(
        """
        Enter patient health information to
        obtain a machine learning prediction,
        risk level, and explainable results.
        """
    )

    st.info(
        """
        This application is intended for
        educational and research purposes.
        It is not a medical diagnosis tool.
        """
    )

    st.divider()

    st.header(
        "Patient Information"
    )

    col1, col2 = st.columns(2)
        # ========================================================
    # LEFT COLUMN
    # ========================================================

    with col1:

        age = st.number_input(
            "Age",
            min_value=1,
            max_value=120,
            value=40,
            step=1
        )

        sex = st.selectbox(
            "Sex",
            [
                "Female",
                "Male"
            ]
        )

        cp_label = st.selectbox(
            "Chest Pain Type",
            [
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

        trestbps = st.number_input(
            "Resting Blood Pressure (mmHg)",
            min_value=50,
            max_value=250,
            value=120
        )

        chol = st.number_input(
            "Cholesterol (mg/dL)",
            min_value=50,
            max_value=700,
            value=200
        )

        fbs_label = st.selectbox(
            "Fasting Blood Sugar > 120 mg/dL",
            [
                "No",
                "Yes"
            ]
        )

        fbs = 1 if fbs_label == "Yes" else 0

        restecg_label = st.selectbox(
            "Resting ECG",
            [
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

        restecg = restecg_mapping[
            restecg_label
        ]


    # ========================================================
    # RIGHT COLUMN
    # ========================================================

    with col2:

        thalach = st.number_input(
            "Maximum Heart Rate",
            min_value=50,
            max_value=250,
            value=150
        )

        exang_label = st.selectbox(
            "Exercise-Induced Angina",
            [
                "No",
                "Yes"
            ]
        )

        exang = (
            1
            if exang_label == "Yes"
            else 0
        )

        oldpeak = st.number_input(
            "ST Depression",
            min_value=0.0,
            max_value=10.0,
            value=1.0,
            step=0.1
        )

        slope_label = st.selectbox(
            "ST Segment Slope",
            [
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

        slope = slope_mapping[
            slope_label
        ]

        ca = st.selectbox(
            "Number of Major Vessels",
            [
                0,
                1,
                2,
                3
            ]
        )

        thal_label = st.selectbox(
            "Thalassemia",
            [
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

        thal = thal_mapping[
            thal_label
        ]


    # ========================================================
    # CONVERT TO MODEL FORMAT
    # ========================================================

    sex_value = (
        1
        if sex == "Male"
        else 0
    )

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


    st.divider()

    if st.button(
        "🔍 Predict Heart Disease Risk",
        type="primary",
        use_container_width=True
    ):

        result = predict_patient(
            patient_data
        )

        st.session_state.prediction_result = result

        st.session_state.patient_data = (
            patient_data
        )

        save_prediction(
            patient_data,
            result["prediction"],
            result["probability"],
            result["risk"]
        )
            # ========================================================
    # DISPLAY PREDICTION RESULT
    # ========================================================

    if st.session_state.prediction_result is not None:

        result = (
            st.session_state.prediction_result
        )

        prediction = (
            result["prediction"]
        )

        probability = (
            result["probability"]
        )

        risk = (
            result["risk"]
        )

        # ====================================================
        # RESULT HEADER
        # ====================================================

        st.header(
            "Prediction Result"
        )

        if prediction == 1:

            st.error(
                """
                ⚠️ Model Prediction:
                Heart Disease Detected
                """
            )

        else:

            st.success(
                """
                ✅ Model Prediction:
                No Heart Disease
                """
            )


        # ====================================================
        # METRICS
        # ====================================================

        metric_col1, metric_col2, metric_col3 = (
            st.columns(3)
        )

        with metric_col1:

            st.metric(
                "Probability",
                f"{probability * 100:.2f}%"
            )

        with metric_col2:

            st.metric(
                "Risk Level",
                risk
            )

        with metric_col3:

            if prediction == 1:

                st.metric(
                    "Classification",
                    "Positive"
                )

            else:

                st.metric(
                    "Classification",
                    "Negative"
                )


        st.divider()


        # ====================================================
        # SHAP EXPLANATION
        # ====================================================

        st.header(
            "🔎 Why did the model make this prediction?"
        )

        st.write(
            """
            The model uses SHAP values to explain
            which features had the strongest
            influence on the prediction.
            """
        )

        explanation = (
            result["explanation"]
            .head(10)
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
            """
            Positive SHAP values push the
            prediction toward Heart Disease.

            Negative SHAP values push the
            prediction toward No Heart Disease.
            """
        )


        # ====================================================
        # SHAP BAR CHART
        # ====================================================

        st.subheader(
            "📊 Feature Importance"
        )

        chart_df = (
            explanation
            .head(10)
            .copy()
        )

        fig, ax = plt.subplots(
            figsize=(8, 5)
        )

        ax.barh(
            chart_df["Feature"],
            chart_df["SHAP"].abs()
        )

        ax.set_xlabel(
            "Absolute SHAP Value"
        )

        ax.set_ylabel(
            "Feature"
        )

        ax.set_title(
            "Top Influencing Features"
        )

        st.pyplot(fig)

        plt.close(fig)


        st.divider()
                # ====================================================
        # WHAT-IF ANALYSIS
        # ====================================================

        st.header(
            "🔄 What-If Analysis"
        )

        st.write(
            """
            Modify health parameters and observe
            how the model prediction changes.
            """
        )

        original_patient = (
            st.session_state.patient_data
        )

        whatif_col1, whatif_col2 = st.columns(2)

        # ====================================================
        # WHAT-IF INPUTS
        # ====================================================

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

            whatif_thalach = st.number_input(
                "What-If Maximum Heart Rate",
                min_value=50,
                max_value=250,
                value=int(
                    original_patient["thalach"]
                ),
                step=1,
                key="whatif_hr"
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

            whatif_oldpeak = st.number_input(
                "What-If ST Depression",
                min_value=0.0,
                max_value=10.0,
                value=float(
                    original_patient["oldpeak"]
                ),
                step=0.1,
                key="whatif_oldpeak"
            )

        # ====================================================
        # RUN WHAT-IF
        # ====================================================

        if st.button(
            "🔄 Run What-If Analysis",
            use_container_width=True
        ):

            modified_patient = (
                original_patient.copy()
            )

            modified_patient["chol"] = (
                whatif_chol
            )

            modified_patient["trestbps"] = (
                whatif_bp
            )

            modified_patient["thalach"] = (
                whatif_thalach
            )

            modified_patient["oldpeak"] = (
                whatif_oldpeak
            )

            whatif_result = (
                predict_patient(
                    modified_patient
                )
            )

            # ================================================
            # COMPARISON TABLE
            # ================================================

            st.subheader(
                "Original vs What-If Result"
            )

            original_prediction_text = (
                "Heart Disease"
                if prediction == 1
                else "No Heart Disease"
            )

            whatif_prediction_text = (
                "Heart Disease"
                if whatif_result[
                    "prediction"
                ] == 1
                else "No Heart Disease"
            )

            comparison_df = pd.DataFrame({

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
                comparison_df,
                use_container_width=True,
                hide_index=True
            )

            # ================================================
            # PROBABILITY CHANGE
            # ================================================

            probability_change = (
                whatif_result[
                    "probability"
                ]
                -
                probability
            )

            if probability_change > 0:

                st.warning(
                    f"""
                    Model probability increased by
                    {probability_change * 100:.2f}
                    percentage points.
                    """
                )

            elif probability_change < 0:

                st.success(
                    f"""
                    Model probability decreased by
                    {abs(probability_change) * 100:.2f}
                    percentage points.
                    """
                )

            else:

                st.info(
                    "No change in probability."
                )

            # ================================================
            # VALUES CHANGED
            # ================================================

            st.subheader(
                "Modified Parameters"
            )

            changes_df = pd.DataFrame({

                "Parameter": [
                    "Cholesterol",
                    "Blood Pressure",
                    "Maximum Heart Rate",
                    "ST Depression"
                ],

                "Original": [
                    original_patient["chol"],
                    original_patient["trestbps"],
                    original_patient["thalach"],
                    original_patient["oldpeak"]
                ],

                "What-If": [
                    whatif_chol,
                    whatif_bp,
                    whatif_thalach,
                    whatif_oldpeak
                ]

            })

            st.dataframe(
                changes_df,
                use_container_width=True,
                hide_index=True
            )

            # ================================================
            # BAR CHART
            # ================================================

            st.subheader(
                "📊 Probability Comparison"
            )

            fig2, ax2 = plt.subplots(
                figsize=(8, 4)
            )

            probs = [
                probability * 100,
                whatif_result[
                    "probability"
                ] * 100
            ]

            labels = [
                "Original",
                "What-If"
            ]

            bars = ax2.bar(
                labels,
                probs
            )

            ax2.set_ylim(
                0,
                100
            )

            ax2.set_ylabel(
                "Probability (%)"
            )

            ax2.set_title(
                "Prediction Comparison"
            )

            for bar, value in zip(
                bars,
                probs
            ):

                ax2.text(
                    bar.get_x()
                    + bar.get_width()/2,
                    value + 2,
                    f"{value:.2f}%",
                    ha="center"
                )

            st.pyplot(fig2)

            plt.close(fig2)

            # ================================================
            # WHAT-IF EXPLANATION
            # ================================================

            st.subheader(
                "🔎 Updated Feature Influence"
            )

            st.dataframe(
                whatif_result[
                    "explanation"
                ].head(10)[
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
                """
                The explanation above shows
                which features influenced the
                new prediction after the
                parameter changes.
                """
            )

        st.divider()
        # ============================================================
# PAGE 2 — MODEL COMPARISON
# ============================================================

elif page == "🔬 Model Comparison":

    st.title(
        "🔬 Model Comparison"
    )

    st.write(
        """
        Comparison of Classical and Quantum
        Machine Learning models used in the
        Heart Disease Prediction Project.
        """
    )

    st.info(
        """
        These metrics were obtained using
        the project test dataset.
        """
    )

    # ========================================================
    # LOAD METRICS FILE
    # ========================================================

    metrics_path = os.path.join(
        PROJECT_ROOT,
        "models",
        "model_comparison.json"
    )

    if not os.path.exists(
        metrics_path
    ):

        st.error(
            "model_comparison.json not found."
        )

        st.stop()

    try:

        with open(
            metrics_path,
            "r"
        ) as file:

            metrics_data = json.load(
                file
            )

    except Exception as e:

        st.error(
            "Unable to load metrics."
        )

        st.exception(e)

        st.stop()

    models = metrics_data.get(
        "models",
        []
    )

    if len(models) == 0:

        st.error(
            "No model results found."
        )

        st.stop()

    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    comparison_df = pd.DataFrame(
        models
    )

    comparison_df = (
        comparison_df.rename(
            columns={
                "name": "Model",
                "accuracy": "Accuracy",
                "precision": "Precision",
                "recall": "Recall",
                "f1_score": "F1 Score"
            }
        )
    )

    # ========================================================
    # PERFORMANCE TABLE
    # ========================================================

    st.subheader(
        "📋 Performance Summary"
    )

    display_df = (
        comparison_df.copy()
    )

    for metric in [
        "Accuracy",
        "Precision",
        "Recall",
        "F1 Score"
    ]:

        display_df[metric] = (
            display_df[metric]
            * 100
        ).round(2).astype(str) + "%"

    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    # ========================================================
    # ACCURACY CHART
    # ========================================================

    st.subheader(
        "📊 Accuracy Comparison"
    )

    fig1, ax1 = plt.subplots(
        figsize=(8, 4)
    )

    accuracy_values = (
        comparison_df[
            "Accuracy"
        ] * 100
    )

    bars = ax1.bar(
        comparison_df["Model"],
        accuracy_values
    )

    ax1.set_ylim(
        0,
        100
    )

    ax1.set_ylabel(
        "Accuracy (%)"
    )

    ax1.set_title(
        "Accuracy of Models"
    )

    for bar, value in zip(
        bars,
        accuracy_values
    ):

        ax1.text(
            bar.get_x()
            + bar.get_width() / 2,
            value + 1,
            f"{value:.2f}%",
            ha="center"
        )

    st.pyplot(fig1)

    plt.close(fig1)

    st.divider()

    # ========================================================
    # ALL METRICS CHART
    # ========================================================

    st.subheader(
        "📈 Accuracy, Precision, Recall & F1"
    )

    metrics = [
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

    for idx, metric in enumerate(
        metrics
    ):

        values = (
            comparison_df[metric]
            * 100
        )

        positions = [
            i + (
                idx - 1.5
            ) * width
            for i in x
        ]

        ax2.bar(
            positions,
            values,
            width,
            label=metric
        )

    ax2.set_xticks(
        list(x)
    )

    ax2.set_xticklabels(
        comparison_df["Model"]
    )

    ax2.set_ylim(
        0,
        100
    )

    ax2.set_ylabel(
        "Score (%)"
    )

    ax2.set_title(
        "Overall Model Performance"
    )

    ax2.legend()

    st.pyplot(fig2)

    plt.close(fig2)

    st.divider()

    # ========================================================
    # MODEL CARDS
    # ========================================================

    st.subheader(
        "🧠 Models Used"
    )

    col1, col2, col3 = st.columns(
        3
    )

    # --------------------------------------------------------

    with col1:

        st.markdown(
            "### 🌲 Random Forest"
        )

        st.write(
            """
            Ensemble learning method
            using multiple decision trees.
            """
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[0]['Accuracy']*100:.2f}%"
        )

    # --------------------------------------------------------

    with col2:

        st.markdown(
            "### 📐 SVM"
        )

        st.write(
            """
            Support Vector Machine
            classifier using a decision
            boundary.
            """
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[1]['Accuracy']*100:.2f}%"
        )

    # --------------------------------------------------------

    with col3:

        st.markdown(
            "### ⚛️ Quantum SVM"
        )

        st.write(
            """
            Quantum kernel-based
            classifier using QSVC.
            """
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[2]['Accuracy']*100:.2f}%"
        )

    st.divider()

    # ========================================================
    # PROJECT NOTE
    # ========================================================

    st.subheader(
        "🏗️ Role of Each Model"
    )

    st.markdown(
        """
        ### 🌲 Random Forest

        Primary prediction model used
        in the application.

        SHAP explanations are generated
        using this model.

        ---

        ### 📐 SVM

        Classical baseline model used
        for comparison.

        ---

        ### ⚛️ Quantum SVM

        Quantum Machine Learning model
        built using QSVC and quantum kernels.

        Demonstrates the hybrid
        classical-quantum approach.
        """
    )

    st.warning(
        """
        Model metrics are based on
        project test data and should
        not be interpreted as clinical
        performance.
        """
    )            
    st.dataframe(
                comparison,
                use_container_width=True,
                hide_index=True
            )

            # ============================================
            # Probability Change
            # ============================================

            probability_change = (
                whatif_result["probability"]
                - probability
            )

            if probability_change > 0:

                st.warning(
                    f"Risk increased by "
                    f"{probability_change*100:.2f}%"
                )

            elif probability_change < 0:

                st.success(
                    f"Risk decreased by "
                    f"{abs(probability_change)*100:.2f}%"
                )

            else:

                st.info(
                    "No change in probability."
                )

            # ============================================
            # Changed Values Table
            # ============================================

            st.subheader(
                "Changed Parameters"
            )

            changes_df = pd.DataFrame({

                "Parameter": [
                    "Cholesterol",
                    "Blood Pressure"
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

            # ============================================
            # Probability Chart
            # ============================================

            st.subheader(
                "📊 Prediction Comparison"
            )

            fig, ax = plt.subplots(
                figsize=(7,4)
            )

            labels = [
                "Original",
                "What-If"
            ]

            values = [
                probability*100,
                whatif_result["probability"]*100
            ]

            bars = ax.bar(
                labels,
                values
            )

            ax.set_ylim(
                0,
                100
            )

            ax.set_ylabel(
                "Probability (%)"
            )

            ax.set_title(
                "Prediction Probability"
            )

            for bar in bars:

                height = bar.get_height()

                ax.text(
                    bar.get_x()
                    + bar.get_width()/2,
                    height + 1,
                    f"{height:.2f}%",
                    ha="center"
                )

            st.pyplot(fig)

            plt.close(fig)

            # ============================================
            # SHAP After What-If
            # ============================================

            st.subheader(
                "Top Factors After Change"
            )

            st.dataframe(
                whatif_result[
                    "explanation"
                ][
                    [
                        "Feature",
                        "Value",
                        "SHAP"
                    ]
                ].head(5),
                use_container_width=True,
                hide_index=True
            )

# ===================================================
# PAGE 2
# MODEL COMPARISON
# ===================================================

elif page == "🔬 Model Comparison":

    st.title(
        "🔬 Model Comparison"
    )

    st.write(
        "Comparison between Classical "
        "and Quantum Machine Learning models."
    )

    metrics_path = os.path.join(
        PROJECT_ROOT,
        "models",
        "model_comparison.json"
    )

    if not os.path.exists(
        metrics_path
    ):

        st.error(
            "model_comparison.json not found"
        )

        st.stop()

    with open(
        metrics_path,
        "r"
    ) as file:

        metrics_data = json.load(
            file
        )
            models = metrics_data.get(
        "models",
        []
    )

    if len(models) == 0:

        st.error(
            "No model metrics found."
        )

        st.stop()

    comparison_df = pd.DataFrame(
        models
    )

    comparison_df = comparison_df.rename(
        columns={
            "name": "Model",
            "accuracy": "Accuracy",
            "precision": "Precision",
            "recall": "Recall",
            "f1_score": "F1 Score"
        }
    )

    # ============================================
    # Performance Table
    # ============================================

    st.subheader(
        "📋 Performance Summary"
    )

    display_df = comparison_df.copy()

    for metric in [
        "Accuracy",
        "Precision",
        "Recall",
        "F1 Score"
    ]:

        display_df[metric] = (
            display_df[metric] * 100
        ).round(2).astype(str) + "%"

    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )

    # ============================================
    # Accuracy Chart
    # ============================================

    st.subheader(
        "📊 Accuracy Comparison"
    )

    fig1, ax1 = plt.subplots(
        figsize=(8,4)
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

    ax1.set_ylim(
        0,
        100
    )

    ax1.set_title(
        "Accuracy Comparison"
    )

    for bar, value in zip(
        bars,
        accuracy_values
    ):

        ax1.text(
            bar.get_x()
            + bar.get_width()/2,
            value + 1,
            f"{value:.2f}%",
            ha="center"
        )

    st.pyplot(fig1)

    plt.close(fig1)

    # ============================================
    # All Metrics Chart
    # ============================================

    st.subheader(
        "📈 Full Model Evaluation"
    )

    metrics = [
        "Accuracy",
        "Precision",
        "Recall",
        "F1 Score"
    ]

    fig2, ax2 = plt.subplots(
        figsize=(10,5)
    )

    x = range(
        len(comparison_df)
    )

    width = 0.18

    for idx, metric in enumerate(
        metrics
    ):

        values = (
            comparison_df[metric]
            * 100
        )

        positions = [
            i + (
                idx - 1.5
            ) * width
            for i in x
        ]

        ax2.bar(
            positions,
            values,
            width,
            label=metric
        )

    ax2.set_xticks(
        list(x)
    )

    ax2.set_xticklabels(
        comparison_df["Model"]
    )

    ax2.set_ylim(
        0,
        100
    )

    ax2.set_ylabel(
        "Score (%)"
    )

    ax2.legend()

    st.pyplot(fig2)

    plt.close(fig2)
        # ============================================
    # Model Cards
    # ============================================

    st.divider()

    st.subheader(
        "🧠 Models Used"
    )

    col1, col2, col3 = st.columns(3)

    # ----------------------------------------
    # Random Forest
    # ----------------------------------------

    with col1:

        st.markdown(
            "### 🌲 Random Forest"
        )

        st.write(
            "Primary prediction model used "
            "inside the application."
        )

        st.write(
            "Provides probability scores, "
            "risk levels and SHAP explanations."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[0]['Accuracy']*100:.2f}%"
        )

    # ----------------------------------------
    # SVM
    # ----------------------------------------

    with col2:

        st.markdown(
            "### 📐 Support Vector Machine"
        )

        st.write(
            "Classical machine learning "
            "algorithm used for comparison."
        )

        st.write(
            "Finds the optimal decision "
            "boundary between classes."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[1]['Accuracy']*100:.2f}%"
        )

    # ----------------------------------------
    # Quantum SVM
    # ----------------------------------------

    with col3:

        st.markdown(
            "### ⚛️ Quantum SVM"
        )

        st.write(
            "Quantum machine learning model "
            "built using Qiskit QSVC."
        )

        st.write(
            "Uses a quantum feature map "
            "and quantum kernel."
        )

        st.metric(
            "Accuracy",
            f"{comparison_df.iloc[2]['Accuracy']*100:.2f}%"
        )

    # ============================================
    # Project Architecture
    # ============================================

    st.divider()

    st.subheader(
        "🏗️ Project Architecture"
    )

    st.markdown(
        """
        ### Prediction Pipeline

        1. User enters health data.

        2. Data is passed to the trained
           Random Forest model.

        3. Model predicts:

           - Heart Disease / No Disease
           - Probability
           - Risk Level

        4. SHAP explains the decision.

        5. Prediction is stored in history.

        6. User can perform What-If analysis.

        7. PDF report can be generated.
        """
    )

    st.warning(
        "Quantum SVM is included for "
        "research comparison purposes."
    )

# ===================================================
# PAGE 3
# PREDICTION HISTORY
# ===================================================

elif page == "📜 Prediction History":

    st.title(
        "📜 Prediction History"
    )

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
        )        # ============================================
        # Download CSV
        # ============================================

        st.download_button(
            label="⬇ Download History CSV",
            data=history_df.to_csv(
                index=False
            ),
            file_name=
            "prediction_history.csv",
            mime="text/csv"
        )

        # ============================================
        # Recent Predictions
        # ============================================

        st.subheader(
            "🕒 Latest Predictions"
        )

        latest_df = (
            history_df
            .tail(10)
            .iloc[::-1]
        )

        st.dataframe(
            latest_df,
            use_container_width=True,
            hide_index=True
        )

        # ============================================
        # Risk Pie Chart
        # ============================================

        st.subheader(
            "📊 Risk Level Distribution"
        )

        fig3, ax3 = plt.subplots(
            figsize=(6,6)
        )

        ax3.pie(
            risk_counts.values,
            labels=risk_counts.index,
            autopct="%1.1f%%"
        )

        ax3.set_title(
            "Prediction Risk Levels"
        )

        st.pyplot(fig3)

        plt.close(fig3)

        # ============================================
        # Statistics
        # ============================================

        st.subheader(
            "📈 History Statistics"
        )

        col_a, col_b, col_c = st.columns(3)

        with col_a:

            st.metric(
                "Total Records",
                len(history_df)
            )

        with col_b:

            heart_cases = len(
                history_df[
                    history_df[
                        "Prediction"
                    ] == "Heart Disease"
                ]
            )

            st.metric(
                "Heart Disease Cases",
                heart_cases
            )

        with col_c:

            no_cases = len(
                history_df[
                    history_df[
                        "Prediction"
                    ] == "No Heart Disease"
                ]
            )

            st.metric(
                "No Disease Cases",
                no_cases
            )

# ===================================================
# PAGE 4
# PDF REPORT
# ===================================================

elif page == "📄 Generate Report":

    st.title(
        "📄 Generate Report"
    )

    if (
        st.session_state
        .prediction_result
        is None
    ):

        st.warning(
            "Please run a prediction first."
        )

    else:

        st.success(
            "Prediction available."
        )

        st.write(
            "Generate a downloadable PDF "
            "containing prediction details, "
            "risk assessment and model results."
        )

        from src.report_generator import (
            generate_report
        )

        patient_data = (
            st.session_state
            .patient_data
        )

        prediction_result = (
            st.session_state
            .prediction_result
        )        # ============================================
        # Model Results For Report
        # ============================================

        model_metrics = [

            [
                "Random Forest",
                "86.67%"
            ],

            [
                "SVM",
                "85.00%"
            ],

            [
                "Quantum SVM",
                "66.67%"
            ]

        ]

        output_file = (
            "heart_report.pdf"
        )

        # ============================================
        # Generate PDF
        # ============================================

        if st.button(
            "📄 Generate PDF Report",
            type="primary",
            use_container_width=True
        ):

            generate_report(
                patient_data,
                prediction_result,
                model_metrics,
                output_file
            )

            st.success(
                "PDF Report Generated Successfully!"
            )

            with open(
                output_file,
                "rb"
            ) as pdf:

                st.download_button(

                    label=
                    "⬇ Download PDF Report",

                    data=pdf,

                    file_name=
                    "Heart_Disease_Report.pdf",

                    mime=
                    "application/pdf",

                    use_container_width=True
                )

        # ============================================
        # Report Preview
        # ============================================

        st.divider()

        st.subheader(
            "📋 Report Preview"
        )

        prediction_text = (
            "Heart Disease"
            if prediction_result[
                "prediction"
            ] == 1
            else
            "No Heart Disease"
        )

        st.write(
            f"**Prediction:** "
            f"{prediction_text}"
        )

        st.write(
            f"**Probability:** "
            f"{prediction_result['probability']*100:.2f}%"
        )

        st.write(
            f"**Risk Level:** "
            f"{prediction_result['risk']}"
        )

        st.write(
            "Top influencing factors:"
        )

        st.dataframe(

            prediction_result[
                "explanation"
            ][
                [
                    "Feature",
                    "Value",
                    "SHAP"
                ]
            ].head(5),

            use_container_width=True,
            hide_index=True
        )

# ===================================================
# END OF APP
# ===================================================