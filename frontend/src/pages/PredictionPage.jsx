import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Heart, 
  ClipboardCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Info, 
  Zap,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { SAMPLE_PATIENTS } from '../services/samplePatients';

export default function PredictionPage({ 
  formData, 
  setFormData, 
  onSubmitPrediction, 
  isLoading 
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Demographics', subtitle: 'Age, Sex & Vitals', icon: User },
    { number: 2, title: 'Clinical Labs', subtitle: 'Lipids & ST Response', icon: Activity },
    { number: 3, title: 'Cardiac History', subtitle: 'Angina, ECG & Vessels', icon: Heart },
    { number: 4, title: 'Review & Submit', subtitle: 'Audit & Predict', icon: ClipboardCheck },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoadPreset = (preset) => {
    setFormData({ ...preset.data });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clinical Intake Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Heart Disease Predictive Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the 13 clinical biomarkers below or load a preset case to calculate estimated coronary disease risk.
        </p>
      </div>

      {/* 1-Click Quick Preset Loaders */}
      <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quick-Load Clinical Presets</span>
          </div>
          <span className="text-[11px] text-slate-400">1-click populated profiles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PATIENTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {p.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${p.badgeColor}`}>
                  {p.data.age}yo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{p.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step Wizard Progress Bar */}
      <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStep(s.number)}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 rounded-xl text-left transition cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50/80 text-blue-900 ring-1 ring-blue-300'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-slate-50'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold leading-tight">{s.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{s.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Form Content Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* STEP 1: PATIENT DEMOGRAPHICS & VITALS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 1: Patient Demographics & Baseline Vitals</h3>
              <p className="text-xs text-slate-500">Provide basic identifier, age, sex, and baseline resting blood pressure.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={formData.patient_name || ''}
                  onChange={(e) => handleInputChange('patient_name', e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Medical Record / Patient ID
                </label>
                <input
                  type="text"
                  value={formData.patient_id || ''}
                  onChange={(e) => handleInputChange('patient_id', e.target.value)}
                  placeholder="e.g. CARD-8041"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Age */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Age (years)</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{formData.age} yrs</span>
                </div>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Adult range 18 - 100</p>
              </div>

              {/* Biological Sex */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('sex', 1)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      Number(formData.sex) === 1
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('sex', 0)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      Number(formData.sex) === 0
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Resting Blood Pressure (trestbps) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Resting Blood Pressure (mmHg)
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {formData.trestbps} mmHg
                  </span>
                </div>
                <input
                  type="number"
                  min="80"
                  max="220"
                  value={formData.trestbps}
                  onChange={(e) => handleInputChange('trestbps', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Normal: &lt;120</span>
                  <span>Elevated: 120-129</span>
                  <span>HTN: &ge;130</span>
                </div>
              </div>

              {/* Fasting Blood Sugar (fbs) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fasting Blood Sugar &gt; 120 mg/dL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('fbs', 0)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      Number(formData.fbs) === 0
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Normal (&le; 120 mg/dL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('fbs', 1)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      Number(formData.fbs) === 1
                        ? 'bg-amber-50 border-amber-600 text-amber-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Elevated (&gt; 120 mg/dL)
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Diagnostic marker for impaired fasting glucose / diabetes.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CLINICAL MEASUREMENTS & ST ANALYSIS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 2: Hemodynamic & Stress Test Measurements</h3>
              <p className="text-xs text-slate-500">Serum cholesterol, max heart rate during treadmill, and ST depression.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Serum Cholesterol (chol) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Serum Cholesterol (mg/dL)</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{formData.chol} mg/dL</span>
                </div>
                <input
                  type="number"
                  min="100"
                  max="600"
                  value={formData.chol}
                  onChange={(e) => handleInputChange('chol', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span className="text-emerald-600 font-medium">Desirable: &lt;200</span>
                  <span className="text-amber-600 font-medium">Borderline: 200-239</span>
                  <span className="text-rose-600 font-medium">High: &ge;240</span>
                </div>
              </div>

              {/* Maximum Heart Rate Achieved (thalach) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Maximum Heart Rate (thalach, bpm)</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{formData.thalach} bpm</span>
                </div>
                <input
                  type="number"
                  min="60"
                  max="230"
                  value={formData.thalach}
                  onChange={(e) => handleInputChange('thalach', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Peak heart rate measured during Bruce treadmill protocol.</p>
              </div>

              {/* ST Depression (oldpeak) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">ST Depression (oldpeak, mm)</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{Number(formData.oldpeak).toFixed(1)} mm</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="8.0"
                  value={formData.oldpeak}
                  onChange={(e) => handleInputChange('oldpeak', parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ST-segment depression induced by exercise relative to rest (&ge;1.0 mm is ischemic).
                </p>
              </div>

              {/* ST Segment Slope (slope) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ST Segment Slope
                </label>
                <select
                  value={formData.slope}
                  onChange={(e) => handleInputChange('slope', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  <option value={1}>1: Upsloping (Low risk)</option>
                  <option value={2}>2: Flat (Moderate risk)</option>
                  <option value={3}>3: Downsloping (High risk)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Slope of peak exercise ST segment.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CARDIAC HISTORY & DIAGNOSTIC FINDINGS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 3: Cardiac History & Specialized Diagnostics</h3>
              <p className="text-xs text-slate-500">Chest pain presentation, fluoroscopy vessels, and thallium scintigraphy.</p>
            </div>

            <div className="space-y-5">
              {/* Chest Pain Type (cp) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Chest Pain Classification (cp)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 1, title: 'Typical Angina', desc: 'Substernal chest pressure triggered by physical exertion or stress' },
                    { id: 2, title: 'Atypical Angina', desc: 'Chest discomfort without all classic features of angina pectoris' },
                    { id: 3, title: 'Non-Anginal Pain', desc: 'Pleuritic or musculoskeletal chest wall tenderness' },
                    { id: 4, title: 'Asymptomatic', desc: 'Silent coronary presentation without overt exertional pain' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInputChange('cp', item.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        Number(formData.cp) === item.id
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Resting ECG (restecg) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Resting Electrocardiogram (restecg)
                  </label>
                  <select
                    value={formData.restecg}
                    onChange={(e) => handleInputChange('restecg', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value={0}>0: Normal Resting ECG</option>
                    <option value={1}>1: ST-T Wave Abnormality (T inversion / ST elevation)</option>
                    <option value={2}>2: Left Ventricular Hypertrophy (Estes' criteria)</option>
                  </select>
                </div>

                {/* Exercise-Induced Angina (exang) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Exercise-Induced Angina (exang)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange('exang', 0)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        Number(formData.exang) === 0
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      No (Absent)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('exang', 1)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        Number(formData.exang) === 1
                          ? 'bg-rose-50 border-rose-600 text-rose-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Yes (Provoked)
                    </button>
                  </div>
                </div>

                {/* Major Fluoroscopy Vessels (ca) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Major Vessels Colored by Fluoroscopy (ca: 0 - 3)
                  </label>
                  <select
                    value={formData.ca}
                    onChange={(e) => handleInputChange('ca', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value={0}>0: No major vessels calcified/stenosed (Clear)</option>
                    <option value={1}>1: One major coronary vessel visible</option>
                    <option value={2}>2: Two major coronary vessels visible</option>
                    <option value={3}>3: Three major coronary vessels visible</option>
                  </select>
                </div>

                {/* Thalassemia Scintigraphy (thal) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Thallium Stress Scintigraphy (thal)
                  </label>
                  <select
                    value={formData.thal}
                    onChange={(e) => handleInputChange('thal', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value={3}>3: Normal Myocardial Perfusion</option>
                    <option value={6}>6: Fixed Defect (Previous Infarction / Scar)</option>
                    <option value={7}>7: Reversible Defect (Inducible Ischemia - High Risk)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 4: Clinical Review & Diagnostic Inference</h3>
              <p className="text-xs text-slate-500">Confirm all 13 biomarkers before submitting to the Random Forest model.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Demographics Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Demographics</span>
                  <span className="text-[10px] text-blue-600 cursor-pointer" onClick={() => setCurrentStep(1)}>Edit</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-semibold text-slate-900">{formData.patient_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age / Sex:</span>
                    <span className="font-semibold text-slate-900">{formData.age} yo ({formData.sex === 1 ? 'M' : 'F'})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resting BP:</span>
                    <span className="font-semibold text-slate-900">{formData.trestbps} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FBS &gt; 120:</span>
                    <span className="font-semibold text-slate-900">{formData.fbs === 1 ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Labs & Stress Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Labs & Vitals</span>
                  <span className="text-[10px] text-blue-600 cursor-pointer" onClick={() => setCurrentStep(2)}>Edit</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Cholesterol:</span>
                    <span className="font-semibold text-slate-900">{formData.chol} mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max HR:</span>
                    <span className="font-semibold text-slate-900">{formData.thalach} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ST Depression:</span>
                    <span className="font-semibold text-slate-900">{Number(formData.oldpeak).toFixed(1)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ST Slope:</span>
                    <span className="font-semibold text-slate-900">{['', 'Upsloping', 'Flat', 'Downsloping'][formData.slope]}</span>
                  </div>
                </div>
              </div>

              {/* History & Tests Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Diagnostics</span>
                  <span className="text-[10px] text-blue-600 cursor-pointer" onClick={() => setCurrentStep(3)}>Edit</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Chest Pain:</span>
                    <span className="font-semibold text-slate-900">{['', 'Typical', 'Atypical', 'Non-anginal', 'Asymptomatic'][formData.cp]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resting ECG:</span>
                    <span className="font-semibold text-slate-900">{['Normal', 'ST-T Abn', 'LVH'][formData.restecg]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exercise Angina:</span>
                    <span className="font-semibold text-slate-900">{formData.exang === 1 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thalassemia:</span>
                    <span className="font-semibold text-slate-900">{formData.thal === 7 ? 'Reversible' : formData.thal === 6 ? 'Fixed' : 'Normal'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Notice */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-800">
              <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                All 13 clinical biomarkers are valid. Submitting will execute the Random Forest decision tree ensemble, compute Lundberg & Lee SHAP values, and generate clinical recommendations.
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              disabled={isLoading}
              onClick={onSubmitPrediction}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Random Forest & SHAP Attributions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Execute Cardiovascular AI Prediction</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentStep === 1
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            Step {currentStep} of 4
          </span>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </div>
    </div>
  );
}


