import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PredictionPage from './pages/PredictionPage';
import ResultsPage from './pages/ResultsPage';
import ExplainablePage from './pages/ExplainablePage';
import ModelComparisonPage from './pages/ModelComparisonPage';
import HistoryPage from './pages/HistoryPage';
import ReportPage from './pages/ReportPage';
import { SAMPLE_PATIENTS } from './services/samplePatients';
import { checkBackendHealth, predictPatientRisk, saveLocalHistory } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for Wizard
  const [formData, setFormData] = useState({
    patient_id: 'CARD-8041',
    patient_name: 'Marcus Vance',
    age: 63,
    sex: 1, // Male
    cp: 4, // Asymptomatic
    trestbps: 152,
    chol: 286,
    fbs: 1, // > 120
    restecg: 2, // LV Hypertrophy
    thalach: 128,
    exang: 1, // Yes
    oldpeak: 2.4,
    slope: 2, // Flat
    ca: 2,
    thal: 7 // Reversible Defect
  });

  // Current Prediction Result
  const [result, setResult] = useState(null);

  // Initial load: check health and generate initial baseline result
  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      setIsOnline(health.healthy);

      // Pre-compute initial result so dashboards have rich data out-of-the-box
      try {
        const initialRes = await predictPatientRisk({ ...formData, save_to_history: false });
        setResult(initialRes);
      } catch (err) {
        console.error('Initial prediction error:', err);
      }
    }
    init();

    // Check health every 15s
    const interval = setInterval(async () => {
      const h = await checkBackendHealth();
      setIsOnline(h.healthy);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run Prediction
  const handleRunPrediction = async () => {
    setIsLoading(true);
    setHistorySaved(false);
    try {
      const res = await predictPatientRisk(formData);
      setResult(res);
      saveLocalHistory({
        Timestamp: res.timestamp,
        PatientID: res.patient_id,
        PatientName: res.patient_name,
        Age: res.patient_data.age,
        Sex: res.patient_data.sex === 1 ? 'Male' : 'Female',
        Prediction: res.diagnosis,
        Probability: res.risk_percentage,
        Risk: res.risk_category,
        BloodPressure: res.patient_data.trestbps,
        Cholesterol: res.patient_data.chol,
        KeyFactor: res.explanation?.[0]?.feature || 'Clinical indicators',
      });
      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Cardiovascular risk prediction computed successfully!');
    } catch (err) {
      console.error('Prediction failed:', err);
      showToast('Error executing prediction. Fallback engaged.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo from Landing Page
  const handleQuickDemo = async () => {
    const demoPatient = SAMPLE_PATIENTS[0]; // High risk case
    setFormData({ ...demoPatient.data });
    setIsLoading(true);
    try {
      const res = await predictPatientRisk(demoPatient.data);
      setResult(res);
      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Loaded ${demoPatient.name} (${demoPatient.label})`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Save to history button on Results
  const handleSaveToHistory = () => {
    if (!result) return;
    saveLocalHistory({
      Timestamp: result.timestamp,
      PatientID: result.patient_id,
      PatientName: result.patient_name,
      Age: result.patient_data.age,
      Sex: result.patient_data.sex === 1 ? 'Male' : 'Female',
      Prediction: result.diagnosis,
      Probability: result.risk_percentage,
      Risk: result.risk_category,
      BloodPressure: result.patient_data.trestbps,
      Cholesterol: result.patient_data.chol,
      KeyFactor: result.explanation?.[0]?.feature || 'Clinical indicators',
    });
    setHistorySaved(true);
    showToast('Patient record saved to clinical audit logs.');
  };

  // Select patient from History
  const handleSelectPatientRecord = (record) => {
    const probability = Number(record.Probability || 0) / 100;
    const sex = String(record.Sex || '').toLowerCase() === 'male' ? 1 : 0;
    const selectedResult = {
      patient_id: record.PatientID || 'N/A',
      patient_name: record.PatientName || 'Anonymous Patient',
      timestamp: record.Timestamp,
      prediction: record.Prediction === 'Heart Disease' ? 1 : 0,
      diagnosis: record.Prediction || 'Assessment unavailable',
      probability,
      risk_percentage: Number(record.Probability || 0),
      risk_category: record.Risk || 'Unknown',
      confidence_score: Number((Math.max(probability, 1 - probability) * 100).toFixed(1)),
      patient_data: {
        age: Number(record.Age || 0),
        sex,
        trestbps: Number(record.BloodPressure || 0),
        chol: Number(record.Cholesterol || 0),
      },
      explanation: record.KeyFactor ? [{ feature: record.KeyFactor }] : [],
      recommendations: [],
    };
    setResult(selectedResult);
    showToast(`Viewing report for ${selectedResult.patient_name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isOnline={isOnline}
        hasResult={Boolean(result)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onQuickDemo={handleQuickDemo}
          />
        )}

        {activePage === 'predict' && (
          <PredictionPage
            formData={formData}
            setFormData={setFormData}
            onSubmitPrediction={handleRunPrediction}
            isLoading={isLoading}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            result={result}
            setActivePage={setActivePage}
            onSaveToHistory={handleSaveToHistory}
            historySaved={historySaved}
          />
        )}

        {activePage === 'explainable' && (
          <ExplainablePage
            result={result}
            onUpdatePatientData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'models' && (
          <ModelComparisonPage
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            onSelectPatientRecord={handleSelectPatientRecord}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'report' && (
          <ReportPage
            result={result}
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
