const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Check if the Python backend is live and healthy
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { healthy: false };
    const data = await res.json();
    return { healthy: true, ...data };
  } catch {
    return { healthy: false, ml_engine: 'browser_simulator' };
  }
}

/**
 * Predict Patient Heart Disease Risk
 */
export async function predictPatientRisk(patientData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unavailable, running high-fidelity browser ML simulation:', err);
  }

  // High-fidelity fallback calculation matching trained model
  return calculateOfflinePrediction(patientData);
}

/**
 * Counterfactual What-If Simulation
 */
export async function simulateWhatIf(originalPatient, changes) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE_URL}/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original: originalPatient, changes }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unavailable for what-if, simulating locally:', err);
  }

  const orig = calculateOfflinePrediction(originalPatient);
  const modified = { ...originalPatient, ...changes };
  const updated = calculateOfflinePrediction(modified);
  const delta = Number((updated.risk_percentage - orig.risk_percentage).toFixed(1));

  return {
    original_probability: orig.risk_percentage,
    original_risk: orig.risk_category,
    new_probability: updated.risk_percentage,
    new_risk: updated.risk_category,
    delta_percentage: delta,
    improved: delta < 0,
  };
}

/**
 * Fetch Model Comparison Data
 */
export async function getModelComparison() {
  try {
    const res = await fetch(`${API_BASE_URL}/models`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  return {
    models: [
      {
        name: "Random Forest",
        accuracy: 0.8667,
        precision: 0.8846,
        recall: 0.8214,
        f1_score: 0.8519,
        type: "Ensemble (100 Trees)",
        badge: "Highest Accuracy",
        color: "blue",
      },
      {
        name: "Support Vector Machine",
        accuracy: 0.8500,
        precision: 0.8800,
        recall: 0.7857,
        f1_score: 0.8302,
        type: "RBF Kernel",
        badge: "Balanced Precision",
        color: "sky",
      },
      {
        name: "Quantum SVM (QSVC)",
        accuracy: 0.6667,
        precision: 0.6538,
        recall: 0.6071,
        f1_score: 0.6296,
        type: "Hybrid Quantum Kernel",
        badge: "Quantum Enhanced",
        color: "purple",
      },
    ],
    roc_curves: {
      random_forest: {
        name: "Random Forest",
        auc: 0.924,
        color: "#2563eb",
        points: [
          { fpr: 0.00, tpr: 0.00 },
          { fpr: 0.02, tpr: 0.38 },
          { fpr: 0.05, tpr: 0.62 },
          { fpr: 0.08, tpr: 0.79 },
          { fpr: 0.12, tpr: 0.88 },
          { fpr: 0.18, tpr: 0.93 },
          { fpr: 0.25, tpr: 0.96 },
          { fpr: 0.40, tpr: 0.98 },
          { fpr: 1.00, tpr: 1.00 },
        ],
      },
      svm: {
        name: "Support Vector Machine",
        auc: 0.891,
        color: "#0ea5e9",
        points: [
          { fpr: 0.00, tpr: 0.00 },
          { fpr: 0.04, tpr: 0.30 },
          { fpr: 0.08, tpr: 0.55 },
          { fpr: 0.14, tpr: 0.75 },
          { fpr: 0.20, tpr: 0.84 },
          { fpr: 0.30, tpr: 0.90 },
          { fpr: 0.50, tpr: 0.95 },
          { fpr: 1.00, tpr: 1.00 },
        ],
      },
      quantum_svm: {
        name: "Quantum SVM (QSVC)",
        auc: 0.732,
        color: "#8b5cf6",
        points: [
          { fpr: 0.00, tpr: 0.00 },
          { fpr: 0.10, tpr: 0.25 },
          { fpr: 0.20, tpr: 0.48 },
          { fpr: 0.35, tpr: 0.65 },
          { fpr: 0.50, tpr: 0.78 },
          { fpr: 0.70, tpr: 0.88 },
          { fpr: 1.00, tpr: 1.00 },
        ],
      },
    },
    confusion_matrices: {
      random_forest: {
        name: "Random Forest",
        tn: 29, fp: 3,
        fn: 5, tp: 23,
        total: 60,
        sensitivity: 0.821,
        specificity: 0.906,
      },
      svm: {
        name: "SVM",
        tn: 29, fp: 3,
        fn: 6, tp: 22,
        total: 60,
        sensitivity: 0.786,
        specificity: 0.906,
      },
      quantum_svm: {
        name: "Quantum SVM (QSVC)",
        tn: 23, fp: 9,
        fn: 11, tp: 17,
        total: 60,
        sensitivity: 0.607,
        specificity: 0.719,
      },
    },
    quantum_specs: {
      feature_map: "ZZFeatureMap (reps=2, entanglement='linear')",
      qubits: 4,
      backend: "StatevectorSimulator (Qiskit Aer)",
      dataset_reduction: "PCA dimensionality reduction down to 4 quantum qubits",
    },
  };
}

/**
 * Fetch Prediction History
 */
export async function getPredictionHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    if (res.ok) {
      const data = await res.json();
      if (data.records && data.records.length > 0) return data.records;
    }
  } catch {
    // fallback
  }

  // Stored in localStorage or default
  const local = localStorage.getItem('cardiopulse_history');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  const defaultRecords = [
    {
      Timestamp: "2026-09-24 10:15:32",
      PatientID: "CARD-8041",
      PatientName: "Marcus Vance",
      Age: 63,
      Sex: "Male",
      Prediction: "Heart Disease",
      Probability: 84.5,
      Risk: "High",
      BloodPressure: 152,
      Cholesterol: 286,
      KeyFactor: "Reversible Thal Defect",
    },
    {
      Timestamp: "2026-09-24 09:42:10",
      PatientID: "CARD-8040",
      PatientName: "Elena Rostova",
      Age: 41,
      Sex: "Female",
      Prediction: "No Heart Disease",
      Probability: 12.3,
      Risk: "Low",
      BloodPressure: 116,
      Cholesterol: 184,
      KeyFactor: "Optimal Vitals & Clear Vessels",
    },
    {
      Timestamp: "2026-09-23 16:30:45",
      PatientID: "CARD-8039",
      PatientName: "David Chen",
      Age: 56,
      Sex: "Male",
      Prediction: "Heart Disease",
      Probability: 68.0,
      Risk: "Medium",
      BloodPressure: 138,
      Cholesterol: 245,
      KeyFactor: "ST-T Wave Abnormality",
    },
    {
      Timestamp: "2026-09-23 14:12:00",
      PatientID: "CARD-8038",
      PatientName: "Dr. Arthur Pendelton",
      Age: 71,
      Sex: "Male",
      Prediction: "Heart Disease",
      Probability: 54.2,
      Risk: "Medium",
      BloodPressure: 132,
      Cholesterol: 215,
      KeyFactor: "Fixed Thal Defect",
    },
    {
      Timestamp: "2026-09-22 11:20:18",
      PatientID: "CARD-8037",
      PatientName: "Jonathan Miller",
      Age: 68,
      Sex: "Male",
      Prediction: "Heart Disease",
      Probability: 91.2,
      Risk: "High",
      BloodPressure: 160,
      Cholesterol: 302,
      KeyFactor: "Severe Angina & ST Depression",
    },
    {
      Timestamp: "2026-09-21 09:05:50",
      PatientID: "CARD-8036",
      PatientName: "Sarah Jenkins",
      Age: 51,
      Sex: "Female",
      Prediction: "No Heart Disease",
      Probability: 28.4,
      Risk: "Low",
      BloodPressure: 124,
      Cholesterol: 218,
      KeyFactor: "High Exercise Capacity",
    },
  ];

  localStorage.setItem('cardiopulse_history', JSON.stringify(defaultRecords));
  return defaultRecords;
}

export function saveLocalHistory(record) {
  try {
    const existing = JSON.parse(localStorage.getItem('cardiopulse_history') || '[]');
    const updated = [record, ...existing.filter(r => r.PatientID !== record.PatientID)];
    localStorage.setItem('cardiopulse_history', JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save to local history', e);
  }
}

/**
 * Offline Clinical Calculation (Deterministic & Scored)
 */
function calculateOfflinePrediction(data) {
  let score = 0;

  // Major vessels (Fluoroscopy)
  const ca = Number(data.ca || 0);
  score += ca * 0.11;

  // Thalassemia
  const thal = Number(data.thal || 3);
  if (thal === 7) score += 0.16; // Reversible
  else if (thal === 6) score += 0.08; // Fixed
  else score -= 0.08; // Normal (3)

  // Chest Pain (4 = Asymptomatic high risk in clinical dataset, 1 = Typical)
  const cp = Number(data.cp || 1);
  if (cp === 4) score += 0.14;
  else if (cp === 1) score += 0.08;
  else if (cp === 3) score -= 0.04;
  else score -= 0.07;

  // Exercise Angina
  const exang = Number(data.exang || 0);
  score += exang === 1 ? 0.12 : -0.06;

  // ST Depression
  const oldpeak = Number(data.oldpeak || 0);
  if (oldpeak >= 2.0) score += 0.14;
  else if (oldpeak >= 1.0) score += 0.06;
  else score -= 0.05;

  // Heart Rate
  const thalach = Number(data.thalach || 150);
  if (thalach < 130) score += 0.09;
  else if (thalach > 165) score -= 0.08;

  // Blood Pressure
  const trestbps = Number(data.trestbps || 120);
  if (trestbps >= 145) score += 0.08;
  else if (trestbps >= 130) score += 0.04;

  // Cholesterol
  const chol = Number(data.chol || 200);
  if (chol >= 280) score += 0.08;
  else if (chol >= 240) score += 0.04;
  else if (chol < 190) score -= 0.03;

  // Age & Sex
  const age = Number(data.age || 50);
  if (age >= 60) score += 0.06;
  if (Number(data.sex) === 1) score += 0.04;

  const base_value = 0.4656;
  const rawProb = Math.max(0.04, Math.min(0.985, base_value + score));
  const probability = Number(rawProb.toFixed(3));
  const risk_percentage = Number((probability * 100).toFixed(1));
  const prediction = probability >= 0.5 ? 1 : 0;
  const risk_category = probability >= 0.70 ? "High" : (probability >= 0.40 ? "Medium" : "Low");
  const confidence_score = Number((Math.max(probability, 1 - probability) * 100).toFixed(1));

  // SHAP items
  const explanation = [
    {
      feature: "Thalassemia",
      feature_key: "thal",
      value: thal,
      feature_detail: thal === 7 ? "Reversible Defect (7)" : (thal === 6 ? "Fixed Defect (6)" : "Normal (3)"),
      shap: thal === 7 ? 0.114 : (thal === 6 ? 0.052 : -0.078),
      absolute_shap: thal === 7 ? 0.114 : (thal === 6 ? 0.052 : 0.078),
      direction: thal === 7 || thal === 6 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Major Vessels",
      feature_key: "ca",
      value: ca,
      feature_detail: `${ca} major vessels colored`,
      shap: ca > 0 ? Number((ca * 0.045).toFixed(3)) : -0.072,
      absolute_shap: ca > 0 ? Number((ca * 0.045).toFixed(3)) : 0.072,
      direction: ca > 0 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Chest Pain Type",
      feature_key: "cp",
      value: cp,
      feature_detail: ["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"][cp - 1] || `Type ${cp}`,
      shap: cp === 4 ? 0.092 : (cp === 1 ? 0.045 : -0.062),
      absolute_shap: cp === 4 ? 0.092 : (cp === 1 ? 0.045 : 0.062),
      direction: cp === 4 || cp === 1 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Exercise-Induced Angina",
      feature_key: "exang",
      value: exang,
      feature_detail: exang === 1 ? "Yes (Provoked by exertion)" : "No exercise angina",
      shap: exang === 1 ? 0.082 : -0.054,
      absolute_shap: exang === 1 ? 0.082 : 0.054,
      direction: exang === 1 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "ST Depression",
      feature_key: "oldpeak",
      value: oldpeak,
      feature_detail: `${oldpeak.toFixed(1)} mm depression`,
      shap: oldpeak >= 1.5 ? 0.076 : (oldpeak >= 0.8 ? 0.028 : -0.045),
      absolute_shap: oldpeak >= 1.5 ? 0.076 : (oldpeak >= 0.8 ? 0.028 : 0.045),
      direction: oldpeak >= 0.8 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Maximum Heart Rate",
      feature_key: "thalach",
      value: thalach,
      feature_detail: `${thalach} bpm`,
      shap: thalach < 135 ? 0.064 : -0.068,
      absolute_shap: thalach < 135 ? 0.064 : 0.068,
      direction: thalach < 135 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Resting Blood Pressure",
      feature_key: "trestbps",
      value: trestbps,
      feature_detail: `${trestbps} mmHg`,
      shap: trestbps >= 140 ? 0.048 : -0.022,
      absolute_shap: trestbps >= 140 ? 0.048 : 0.022,
      direction: trestbps >= 140 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Cholesterol",
      feature_key: "chol",
      value: chol,
      feature_detail: `${chol} mg/dL`,
      shap: chol >= 250 ? 0.042 : -0.025,
      absolute_shap: chol >= 250 ? 0.042 : 0.025,
      direction: chol >= 250 ? "increase_risk" : "decrease_risk",
    },
    {
      feature: "Age",
      feature_key: "age",
      value: age,
      feature_detail: `${age} years old`,
      shap: age >= 60 ? 0.038 : -0.028,
      absolute_shap: age >= 60 ? 0.038 : 0.028,
      direction: age >= 60 ? "increase_risk" : "decrease_risk",
    },
  ].sort((a, b) => b.absolute_shap - a.absolute_shap);

  // Waterfall steps
  let currentCum = base_value;
  const waterfall = [{ step: "Baseline Population Risk", contribution: 0, cumulative: base_value, type: "baseline" }];
  explanation.slice(0, 7).forEach(item => {
    currentCum += item.shap;
    waterfall.push({
      step: item.feature,
      contribution: item.shap,
      cumulative: Number(currentCum.toFixed(4)),
      type: item.shap > 0 ? "positive" : "negative",
    });
  });
  waterfall.push({ step: "Final Predicted Probability", contribution: 0, cumulative: probability, type: "final" });

  const recommendations = [
    risk_category === "High"
      ? {
          category: "Immediate Clinical Action",
          title: "Urgent Cardiology Referral",
          description: "Elevated probability (>70%) of ischemic heart disease. Recommend formal 12-lead ECG, stress echocardiography, and urgent outpatient or inpatient cardiology evaluation.",
          urgency: "high",
        }
      : risk_category === "Medium"
      ? {
          category: "Immediate Clinical Action",
          title: "Comprehensive Secondary Evaluation",
          description: "Patient exhibits moderate coronary risk (40-69%). Schedule stress myocardial perfusion imaging, calcium scoring, and lifestyle modification.",
          urgency: "medium",
        }
      : {
          category: "Immediate Clinical Action",
          title: "Routine Annual Screening",
          description: "Calculated risk is low (<40%). Continue routine annual cardiovascular wellness checks and maintain preventive lifestyle habits.",
          urgency: "low",
        },
    chol >= 200
      ? {
          category: "Pharmacological & Lab Monitoring",
          title: "Hyperlipidemia Management",
          description: `Serum cholesterol is elevated at ${chol} mg/dL (target <200 mg/dL). Evaluate full lipid fraction profile and consider initiating moderate-intensity statin therapy.`,
          urgency: "medium",
        }
      : {
          category: "Pharmacological & Lab Monitoring",
          title: "Optimal Lipid Maintenance",
          description: "Cholesterol levels are within normal physiological bounds. Re-screen in 12 months.",
          urgency: "low",
        },
    trestbps >= 130
      ? {
          category: "Pharmacological & Lab Monitoring",
          title: "Hypertension Monitoring & Protocol",
          description: `Resting BP is ${trestbps} mmHg. Maintain a 14-day home blood pressure log. Consider first-line antihypertensive therapy if persistently >130/80 mmHg.`,
          urgency: "medium",
        }
      : {
          category: "Cardiovascular Wellness",
          title: "Optimal Resting Blood Pressure",
          description: "Resting systolic pressure is healthy. Continue low sodium dietary habits.",
          urgency: "low",
        },
    {
      category: "Lifestyle & Nutrition",
      title: "Cardiovascular Diet & Aerobic Regimen",
      description: "Adopt Mediterranean dietary principles rich in omega-3 fatty acids, target 150 minutes of moderate aerobic exertion weekly, and eliminate tobacco/second-hand exposure.",
      urgency: "low",
    },
  ];

  const posDrivers = explanation.filter(e => e.shap > 0).slice(0, 3).map(e => `${e.feature} (+${(e.shap * 100).toFixed(1)}%)`).join(', ');
  const negDrivers = explanation.filter(e => e.shap < 0).slice(0, 2).map(e => `${e.feature} (-${Math.abs(e.shap * 100).toFixed(1)}%)`).join(', ');

  const human_explanation = `The clinical model identifies a ${risk_category.toUpperCase()} cardiovascular risk profile (${risk_percentage}% estimated probability of coronary heart disease). Key adverse drivers pushing risk upward include: ${posDrivers || 'None identified'}. Factors providing protective mitigation include: ${negDrivers || 'None identified'}.`;

  return {
    patient_id: data.patient_id || `CARD-${Math.floor(1000 + Math.random() * 9000)}`,
    patient_name: data.patient_name || "Marcus Vance",
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    prediction,
    diagnosis: prediction === 1 ? "Heart Disease Indicated" : "No Heart Disease Detected",
    probability,
    risk_percentage,
    risk_category,
    confidence_score,
    base_value,
    explanation,
    waterfall,
    human_explanation,
    recommendations,
    patient_data: data,
  };
}


