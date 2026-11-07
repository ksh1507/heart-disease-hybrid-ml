import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  Sliders, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Zap,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import ShapChart from '../components/ShapChart';
import WaterfallChart from '../components/WaterfallChart';
import { simulateWhatIf } from '../services/api';

export default function ExplainablePage({ result, onUpdatePatientData, setActivePage }) {
  const [activeTab, setActiveTab] = useState('shap'); // 'shap' | 'waterfall' | 'simulator'

  // Counterfactual What-If State
  const initialPatient = result?.patient_data || {
    age: 63, sex: 1, cp: 4, trestbps: 152, chol: 286, fbs: 1,
    restecg: 2, thalach: 128, exang: 1, oldpeak: 2.4, slope: 2, ca: 2, thal: 7
  };

  const [simulatorVitals, setSimulatorVitals] = useState({
    chol: initialPatient.chol || 240,
    trestbps: initialPatient.trestbps || 135,
    oldpeak: initialPatient.oldpeak || 1.2,
    thalach: initialPatient.thalach || 145,
    exang: initialPatient.exang || 0,
  });

  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSliderChange = async (key, val) => {
    const updated = { ...simulatorVitals, [key]: val };
    setSimulatorVitals(updated);

    setIsSimulating(true);
    try {
      const res = await simulateWhatIf(initialPatient, { [key]: val });
      setSimResult(res);
    } catch (e) {
      console.error('What-if error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulator = () => {
    setSimulatorVitals({
      chol: initialPatient.chol,
      trestbps: initialPatient.trestbps,
      oldpeak: initialPatient.oldpeak,
      thalach: initialPatient.thalach,
      exang: initialPatient.exang,
    });
    setSimResult(null);
  };

  const explanation = result?.explanation || [];
  const waterfall = result?.waterfall || [];
  const baseValue = result?.base_value || 0.4656;
  const probability = result?.probability || 0.845;
  const humanExplanation = result?.human_explanation || 
    "SHAP game-theoretic analysis demonstrates that severe thallium defect, silent exertional angina, and elevated resting blood pressure contributed the majority of the positive risk shift for this patient.";

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lundberg & Lee TreeExplainer Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explainable AI (XAI) & Biomarker Attribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transparency into feature contributions, waterfall risk accumulation, and counterfactual simulations.
          </p>
        </div>

        {/* Action Link to Report */}
        <button
          onClick={() => setActivePage('report')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Include XAI in PDF Report</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('shap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'shap'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>SHAP Feature Attribution</span>
        </button>

        <button
          onClick={() => setActiveTab('waterfall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'waterfall'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Waterfall Progression</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-500" />
          <span>What-If Simulator</span>
        </button>
      </div>

      {/* Natural Language Narrative Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Clinical Natural Language Interpretation
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {humanExplanation}
        </p>
      </div>

      {/* TAB 1: SHAP Horizontal Feature Importance Chart */}
      {activeTab === 'shap' && (
        <div className="space-y-6">
          <ShapChart explanation={explanation} />

          {/* Explanation Methodology Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              How to Interpret Local SHAP Values
            </h4>
            <p className="leading-relaxed">
              SHAP (SHapley Additive exPlanations) values originate from cooperative game theory. Each biomarker acts as a player contributing to the model's final risk probability. Values on the right (red) indicate features that increased coronary risk above the 46.6% baseline prevalence. Values on the left (emerald) indicate protective clinical characteristics that mitigated the patient's risk.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Waterfall Chart */}
      {activeTab === 'waterfall' && (
        <div className="space-y-6">
          <WaterfallChart
            waterfall={waterfall}
            baseValue={baseValue}
            finalProbability={probability}
          />
        </div>
      )}

      {/* TAB 3: Counterfactual What-If Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900">Interactive Clinical Intervention Simulator</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust patient biomarkers to simulate lifestyle modifications or pharmaceutical therapies and observe the risk delta.
                </p>
              </div>

              <button
                type="button"
                onClick={resetSimulator}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Baseline</span>
              </button>
            </div>

            {/* Simulated Delta Scoreboard */}
            {simResult && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Original Risk</span>
                    <span className="font-bold text-slate-800 text-sm">{simResult.original_probability}%</span>
                    <span className="text-slate-500 ml-1">({simResult.original_risk})</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400" />

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Simulated Risk</span>
                    <span className="font-bold text-blue-700 text-sm">{simResult.new_probability}%</span>
                    <span className="text-slate-500 ml-1">({simResult.new_risk})</span>
                  </div>
                </div>

                {/* Delta Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Net Risk Shift:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      simResult.improved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {simResult.improved ? (
                      <>
                        <ArrowDownRight className="w-4 h-4" />
                        {simResult.delta_percentage}% Risk Reduction
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4" />
                        +{simResult.delta_percentage}% Risk Increase
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cholesterol Slider */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">Serum Cholesterol</label>
                  <span className="font-mono text-xs font-bold text-blue-600">{simulatorVitals.chol} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="400"
                  value={simulatorVitals.chol}
                  onChange={(e) => handleSliderChange('chol', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>130 (Optimal)</span>
                  <span>200 (Threshold)</span>
                  <span>400 (Severe)</span>
                </div>
              </div>

              {/* Resting BP Slider */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">Resting Blood Pressure</label>
                  <span className="font-mono text-xs font-bold text-blue-600">{simulatorVitals.trestbps} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={simulatorVitals.trestbps}
                  onChange={(e) => handleSliderChange('trestbps', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>90 (Normotensive)</span>
                  <span>130 (Stage 1 HTN)</span>
                  <span>200 (Severe)</span>
                </div>
              </div>

              {/* ST Depression Slider */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">ST Depression (oldpeak)</label>
                  <span className="font-mono text-xs font-bold text-blue-600">{Number(simulatorVitals.oldpeak).toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="6.0"
                  step="0.1"
                  value={simulatorVitals.oldpeak}
                  onChange={(e) => handleSliderChange('oldpeak', parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.0 mm (Normal)</span>
                  <span>1.5 mm (Ischemia)</span>
                  <span>6.0 mm (Severe)</span>
                </div>
              </div>

              {/* Max Heart Rate Slider */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">Max Heart Rate Achieved</label>
                  <span className="font-mono text-xs font-bold text-blue-600">{simulatorVitals.thalach} bpm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="210"
                  value={simulatorVitals.thalach}
                  onChange={(e) => handleSliderChange('thalach', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>80 bpm (Low)</span>
                  <span>150 bpm (Target)</span>
                  <span>210 bpm (High)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


