# CardioPulse AI

CardioPulse AI is a clinical decision-support prototype for estimating heart-disease risk from 13 cardiovascular features. It combines a trained Random Forest classifier with SHAP-based local explanations, counterfactual “what-if” analysis, model comparison data, prediction history, and a printable medical report interface.

> **Clinical disclaimer:** This project is for educational, investigational, and physician decision-support purposes only. It is not a medical diagnosis, does not replace a licensed clinician, and must not be used as the sole basis for treatment or emergency decisions.

## Features

- Multi-step patient assessment form
- Random Forest heart-disease prediction
- Low, medium, and high risk categorization
- SHAP feature-importance explanations
- Human-readable clinical recommendations
- Counterfactual “what-if” simulations
- Random Forest, SVM, and Quantum SVM comparison views
- Prediction history with search, filtering, sorting, and CSV/JSON export
- Patient-specific report navigation from history
- Printable medical report view
- Backend health indicator and browser fallback calculations
- Responsive React interface built with Tailwind CSS

## Architecture

```text
┌─────────────────────┐       HTTP / JSON        ┌────────────────────────┐
│ React + Vite client │  ─────────────────────▶  │ Python REST API         │
│ frontend/           │                          │ api_server.py           │
└─────────────────────┘                          └───────────┬────────────┘
                                                            │
                                      ┌─────────────────────┼─────────────────────┐
                                      │                     │                     │
                                Random Forest          SHAP explanations     CSV history
                                models/*.pkl           src/prediction.py     data/*.csv
```

The frontend runs on port `5173` by default. The Python API runs on port `5000`.

## Project structure

```text
.
├── api_server.py                  # Lightweight Python REST API
├── requirements.txt               # Python dependencies
├── data/
│   ├── heart.csv                  # Heart-disease dataset
│   └── prediction_history.csv     # Persisted prediction history
├── models/
│   ├── random_forest.pkl          # Trained Random Forest model
│   ├── svm.pkl                    # SVM model artifact
│   ├── scaler.pkl                 # Feature scaler artifact
│   ├── selected_features.json     # Selected model features
│   └── model_comparison.json      # Comparison metrics and chart data
├── src/
│   ├── prediction.py              # Model inference and SHAP calculation
│   ├── history.py                 # CSV history persistence
│   └── report_generator.py        # ReportLab PDF generation helper
├── reports/                       # Generated reports
└── frontend/
    ├── package.json               # Frontend scripts and dependencies
    ├── vite.config.js             # Vite and Tailwind configuration
    ├── index.html
    └── src/
        ├── App.jsx                # Application state and page routing
        ├── services/api.js        # API client and browser fallback logic
        ├── components/            # Shared UI and visualization components
        └── pages/                 # Landing, prediction, results, history, etc.
```

The repository also contains a nested `heart-disease-hybrid-ml/` directory that appears to be an older bundled copy of the project. Run the application from the repository root containing `api_server.py`, `models/`, `src/`, and `frontend/`.

## Requirements

### Backend

- Python 3.10 or newer
- Recommended/tested environment: Python 3.13
- Required Python packages listed in `requirements.txt`

### Frontend

- Node.js 20 or newer
- npm 10 or newer

## Installation on Windows

Open PowerShell in the project root:

```powershell
cd "C:\Users\Sri Harshita Kemburu\Downloads\heart-disease-hybrid-ml (1)"
```

### 1. Create and activate a Python virtual environment

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks activation, run the backend with the virtual-environment interpreter directly:

```powershell
.\.venv\Scripts\python.exe api_server.py
```

### 2. Install frontend dependencies

```powershell
cd frontend
npm install
cd ..
```

## Running the application

The frontend and backend are separate processes. Start both from two PowerShell windows.

### Terminal 1: start the backend

```powershell
cd "C:\Users\Sri Harshita Kemburu\Downloads\heart-disease-hybrid-ml (1)"
.\.venv\Scripts\python.exe api_server.py 5000
```

The API is available at:

```text
http://localhost:5000
```

### Terminal 2: start the frontend

```powershell
cd "C:\Users\Sri Harshita Kemburu\Downloads\heart-disease-hybrid-ml (1)\frontend"
npm run dev -- --host 127.0.0.1
```

Open the application at:

```text
http://127.0.0.1:5173
```

The Vite development server provides hot module replacement while the API process must remain running for model-backed predictions.

## Frontend commands

Run these commands from `frontend/`:

```powershell
npm run dev       # Start the Vite development server
npm run build     # Create a production build in frontend/dist
npm run preview   # Preview the production build locally
npm run lint      # Run Oxlint
```

## REST API

All API routes are under `/api`.

### Health check

```http
GET /api/health
```

Example response:

```json
{
  "status": "healthy",
  "ml_engine": "online",
  "model_name": "Random Forest Classifier (Ensemble)"
}
```

### Prediction

```http
POST /api/predict
Content-Type: application/json
```

Example request:

```json
{
  "patient_id": "CARD-8041",
  "patient_name": "Example Patient",
  "age": 63,
  "sex": 1,
  "cp": 4,
  "trestbps": 152,
  "chol": 286,
  "fbs": 1,
  "restecg": 2,
  "thalach": 128,
  "exang": 1,
  "oldpeak": 2.4,
  "slope": 2,
  "ca": 2,
  "thal": 7,
  "save_to_history": true
}
```

The response includes the prediction, probability, risk category, confidence score, SHAP explanation, clinical recommendations, timestamp, patient identity, and normalized `patient_data`.

### What-if simulation

```http
POST /api/what-if
Content-Type: application/json
```

Example request:

```json
{
  "original": {
    "age": 63,
    "sex": 1,
    "cp": 4,
    "trestbps": 152,
    "chol": 286,
    "fbs": 1,
    "restecg": 2,
    "thalach": 128,
    "exang": 1,
    "oldpeak": 2.4,
    "slope": 2,
    "ca": 2,
    "thal": 7
  },
  "changes": {
    "trestbps": 125,
    "chol": 205
  }
}
```

The API returns the original probability, new probability, risk categories, percentage delta, and whether the simulated changes improved the score.

### Model comparison

```http
GET /api/models
```

Returns comparison metrics, ROC curve data, confusion matrices, and quantum-model metadata used by the model comparison page.

### Prediction history

```http
GET /api/history
```

Returns persisted history records from `data/prediction_history.csv`. New records include patient identity, age, sex, prediction, probability, risk, blood pressure, cholesterol, timestamp, and key-factor metadata.

### Explicit history save

```http
POST /api/save-history
Content-Type: application/json
```

This route saves an already calculated result to the backend CSV history file.

## Model input features

The model expects the following fields:

| Field | Meaning | Typical encoding |
|---|---|---|
| `age` | Patient age | Numeric years |
| `sex` | Sex | `1` male, `0` female |
| `cp` | Chest pain type | Dataset category `1`–`4` |
| `trestbps` | Resting blood pressure | Numeric mmHg |
| `chol` | Serum cholesterol | Numeric mg/dL |
| `fbs` | Fasting blood sugar | `1` if above threshold, otherwise `0` |
| `restecg` | Resting ECG result | Dataset category `0`–`2` |
| `thalach` | Maximum heart rate achieved | Numeric bpm |
| `exang` | Exercise-induced angina | `1` yes, `0` no |
| `oldpeak` | ST depression | Numeric |
| `slope` | ST segment slope | Dataset category `1`–`3` |
| `ca` | Major vessels | Dataset category `0`–`3` |
| `thal` | Thalassemia result | Dataset values `3`, `6`, or `7` |

Risk thresholds used by the application:

- **Low:** probability below `40%`
- **Medium:** probability from `40%` through below `70%`
- **High:** probability `70%` or above

These are application thresholds, not independently validated clinical thresholds.

## Prediction and history flow

1. A user enters patient demographics and clinical measurements in the prediction wizard.
2. The frontend sends the 13 model features plus optional patient identity to `/api/predict`.
3. The backend loads the Random Forest model and calculates the probability.
4. SHAP generates local feature contributions for the individual prediction.
5. The backend returns clinical recommendations and report-ready data.
6. The prediction is saved to `data/prediction_history.csv` when `save_to_history` is enabled.
7. The history page loads records from the backend and falls back to browser `localStorage` if the API is unavailable.
8. Selecting **View Report** maps the selected history record into the report view, rather than displaying a different active patient.

## Data and generated files

- `data/heart.csv` contains the project dataset.
- `data/prediction_history.csv` stores prediction audit records.
- `models/` contains serialized model artifacts required by the backend.
- `reports/` is intended for generated PDF/report output.
- `frontend/dist/` is generated by `npm run build` and is ignored by Git.
- Python caches, virtual environments, `node_modules`, logs, and environment files are ignored by `.gitignore`.

Do not commit credentials, secrets, private patient information, or generated sensitive reports.

## Troubleshooting

### The frontend says the backend is offline

Confirm the Python API is running and check:

```powershell
Invoke-WebRequest http://localhost:5000/api/health
```

If the API is healthy but the frontend still shows offline, verify that the frontend is using `http://localhost:5000/api` in `frontend/src/services/api.js` and reload the page.

### Model loading fails

Confirm that these files exist in the root `models/` directory:

```text
models/random_forest.pkl
models/svm.pkl
models/scaler.pkl
models/selected_features.json
```

Also verify that the Python environment contains all packages in `requirements.txt`.

### Port already in use

Start the backend on another port:

```powershell
.\.venv\Scripts\python.exe api_server.py 5001
```

If you change the API port, update `API_BASE_URL` in `frontend/src/services/api.js` before starting the frontend.

### Frontend dependency or build issues

From `frontend/`, reinstall dependencies and rebuild:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

## Development notes

- The backend intentionally uses Python’s standard-library `http.server`; it is not a Flask or FastAPI application.
- The frontend is a single-page React application with page state managed in `App.jsx`.
- Browser-side prediction/history fallbacks make the UI usable when the backend is unavailable, but backend-backed SHAP and persistence are preferred.
- Model outputs are estimates generated from the bundled artifacts and should be validated before any real clinical use.

## License and responsibility

Review the project’s licensing and data provenance before redistribution. When modifying the model, dataset, thresholds, or recommendations, document the change and revalidate the resulting behavior before using the application for demonstrations or research.
