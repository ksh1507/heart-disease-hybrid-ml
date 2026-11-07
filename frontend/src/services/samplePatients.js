export const SAMPLE_PATIENTS = [
  {
    id: "CARD-8041",
    name: "Marcus Vance",
    label: "High Risk Profile (Acute / Severe)",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    description: "63M with exertional angina, elevated cholesterol (286 mg/dL), ST depression 2.4mm, and reversible thallium defect.",
    data: {
      patient_id: "CARD-8041",
      patient_name: "Marcus Vance",
      age: 63,
      sex: 1, // Male
      cp: 4, // Asymptomatic
      trestbps: 152,
      chol: 286,
      fbs: 1, // > 120
      restecg: 2, // Left Ventricular Hypertrophy
      thalach: 128,
      exang: 1, // Yes
      oldpeak: 2.4,
      slope: 2, // Flat
      ca: 2,
      thal: 7 // Reversible defect
    }
  },
  {
    id: "CARD-8040",
    name: "Elena Rostova",
    label: "Low Risk Profile (Healthy Screening)",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "41F athlete with normal ECG, optimal lipid profile (184 mg/dL), excellent max HR (172 bpm), and 0 fluoroscopy vessels.",
    data: {
      patient_id: "CARD-8040",
      patient_name: "Elena Rostova",
      age: 41,
      sex: 0, // Female
      cp: 2, // Atypical Angina
      trestbps: 116,
      chol: 184,
      fbs: 0,
      restecg: 0, // Normal
      thalach: 172,
      exang: 0,
      oldpeak: 0.2,
      slope: 1, // Upsloping
      ca: 0,
      thal: 3 // Normal
    }
  },
  {
    id: "CARD-8039",
    name: "David Chen",
    label: "Moderate / Borderline Risk",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "56M with borderline hypertension (138 mmHg), moderate dyslipidemia (245 mg/dL), and flat ST slope.",
    data: {
      patient_id: "CARD-8039",
      patient_name: "David Chen",
      age: 56,
      sex: 1, // Male
      cp: 3, // Non-anginal
      trestbps: 138,
      chol: 245,
      fbs: 0,
      restecg: 1, // ST-T wave abnormality
      thalach: 144,
      exang: 0,
      oldpeak: 1.2,
      slope: 2, // Flat
      ca: 1,
      thal: 3 // Normal
    }
  },
  {
    id: "CARD-8038",
    name: "Dr. Arthur Pendelton",
    label: "Geriatric Normotensive",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description: "71M post-executive screening with mild fixed thalassemia defect and controlled resting blood pressure.",
    data: {
      patient_id: "CARD-8038",
      patient_name: "Dr. Arthur Pendelton",
      age: 71,
      sex: 1, // Male
      cp: 1, // Typical Angina
      trestbps: 132,
      chol: 215,
      fbs: 0,
      restecg: 0,
      thalach: 138,
      exang: 0,
      oldpeak: 1.0,
      slope: 1,
      ca: 1,
      thal: 6 // Fixed Defect
    }
  }
];


