from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet


def generate_report(
    patient_data,
    prediction_result,
    model_metrics,
    output_path
):

    doc = SimpleDocTemplate(str(output_path))

    styles = getSampleStyleSheet()

    elements = []

    # --------------------------------
    # Title
    # --------------------------------

    elements.append(
        Paragraph(
            "Heart Disease Prediction Report",
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 12)
    )

    # --------------------------------
    # Patient Information
    # --------------------------------

    elements.append(
        Paragraph(
            "Patient Information",
            styles["Heading2"]
        )
    )

    patient_table = Table([
        ["Feature", "Value"],
        *[
            [k, str(v)]
            for k, v in patient_data.items()
        ]
    ])

    patient_table.setStyle(
        TableStyle([
            ("GRID", (0,0), (-1,-1), 1, colors.black),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey)
        ])
    )

    elements.append(patient_table)

    elements.append(
        Spacer(1, 20)
    )

    # --------------------------------
    # Prediction Result
    # --------------------------------

    elements.append(
        Paragraph(
            "Prediction Result",
            styles["Heading2"]
        )
    )

    prediction_text = (
        "Heart Disease"
        if prediction_result["prediction"] == 1
        else "No Heart Disease"
    )

    result_table = Table([
        ["Prediction", prediction_text],
        ["Probability",
         f"{prediction_result['probability']*100:.2f}%"],
        ["Risk",
         prediction_result["risk"]]
    ])

    result_table.setStyle(
        TableStyle([
            ("GRID", (0,0), (-1,-1), 1, colors.black),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey)
        ])
    )

    elements.append(result_table)

    elements.append(
        Spacer(1, 20)
    )

    # --------------------------------
    # SHAP Explanation
    # --------------------------------

    elements.append(
        Paragraph(
            "Top Influencing Features",
            styles["Heading2"]
        )
    )

    shap_df = (
        prediction_result["explanation"]
        .head(5)
    )

    shap_table = Table(
        [["Feature", "Value", "SHAP"]] +
        shap_df[
            ["Feature", "Value", "SHAP"]
        ].values.tolist()
    )

    shap_table.setStyle(
        TableStyle([
            ("GRID", (0,0), (-1,-1), 1, colors.black),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey)
        ])
    )

    elements.append(shap_table)

    elements.append(
        Spacer(1, 20)
    )

    # --------------------------------
    # Model Comparison
    # --------------------------------

    elements.append(
        Paragraph(
            "Model Comparison",
            styles["Heading2"]
        )
    )

    metrics_table = Table(
        [["Model", "Accuracy"]] +
        model_metrics
    )

    metrics_table.setStyle(
        TableStyle([
            ("GRID", (0,0), (-1,-1), 1, colors.black),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey)
        ])
    )

    elements.append(metrics_table)

    doc.build(elements)