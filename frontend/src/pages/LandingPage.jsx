import React from 'react';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Cpu, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Zap, 
  Stethoscope,
  BarChart3,
  TrendingUp,
  Lock
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';

export default function LandingPage({ setActivePage, onQuickDemo }) {
  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-100 via-indigo-50 to-sky-100 rounded-full blur-3xl -z-10 opacity-70" />

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Next-Generation Cardiovascular Decision Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Precision Heart Disease Risk Prediction <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Powered by Explainable AI & Quantum ML
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8">
            Empower clinical teams with instant multi-parametric coronary risk stratification, SHAP transparent biomarker attribution, and cutting-edge Quantum SVM benchmarking.
          </p>

          {/* Call-To-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('predict')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Clinical Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onQuickDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Load High-Risk Demo Case</span>
            </button>

            <button
              onClick={() => setActivePage('models')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-500" />
              <span>View Model Benchmarks</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Deterministic & Auditable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>HIPAA-Ready Architecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>13 Validated Clinical Biomarkers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE HERO PREVIEW CARD */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-1 rounded-3xl bg-gradient-to-b from-blue-200/50 via-slate-200/40 to-white shadow-xl shadow-slate-200/50">
          <div className="bg-white rounded-[22px] p-6 sm:p-8 border border-slate-100">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Column: Sample Patient Profile */}
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-rose-700 uppercase">Live Clinical Assessment Preview</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Comprehensive Biomarker Synthesis & Predictive Risk
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  CardioPulse processes patient hemodynamic data (resting blood pressure, serum cholesterol, exercise angina, ST depression) through a calibrated Random Forest model and generates SHAP local explanations.
                </p>

                {/* Quick features checklist */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Real-time Risk Gauge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Waterfall Biomarker Shift</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Counterfactual What-If</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>EHR-Ready PDF Report</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActivePage('results')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Full Interactive Results Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Live Risk Gauge Card */}
              <div className="w-full lg:w-80 shrink-0">
                <RiskGauge
                  percentage={84.5}
                  riskCategory="High"
                  confidenceScore={92.4}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATISTICS CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">Algorithmic Benchmarks</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Validated Accuracy on Rigorous Clinical Datasets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">86.7%</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Random Forest Accuracy</div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Outperforms standard clinical heuristic screening tools on independent test validation sets.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">0.885</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Precision Score (PPV)</div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Minimizes costly false alarms, ensuring clinical investigative workflows remain focused.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">4 Qubits</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Quantum Kernel Hilbert Space</div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              ZZFeatureMap quantum circuit embedding with Qiskit Statevector simulation support.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">&lt;150ms</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Inference & SHAP Latency</div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Ultra-fast local TreeExplainer computation provides real-time bedside decision transparency.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES & FEATURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">Platform Features</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Modern Clinical Cardiology
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Every feature is designed with modern UX principles from Linear and Stripe: fast, focused, and intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div 
            onClick={() => setActivePage('predict')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Multi-Step Form Wizard</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Streamlined 4-step intake for patient demographics, hemodynamic measurements, and cardiac diagnostics with built-in reference validation.
            </p>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Open Wizard <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 2 */}
          <div 
            onClick={() => setActivePage('explainable')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">SHAP & Waterfall Explainability</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Demystify black-box predictions with Lundberg & Lee game-theoretic SHAP attributions, step-by-step waterfalls, and natural language clinical summaries.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore Explainability <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 3 */}
          <div 
            onClick={() => setActivePage('models')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Quantum SVM Benchmarking</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Benchmark classical Random Forest and SVM against Quantum Support Vector Classifiers (QSVC) running on Qiskit circuit simulators.
            </p>
            <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Benchmarks <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 4 */}
          <div 
            onClick={() => setActivePage('explainable')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">What-If Counterfactual Simulator</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Simulate therapeutic interventions (e.g. lowering blood pressure to 120 mmHg or cholesterol to 190 mg/dL) and watch risk recalculate in real-time.
            </p>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Simulate Scenarios <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 5 */}
          <div 
            onClick={() => setActivePage('history')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Longitudinal Patient History</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Track multi-encounter patient histories, filter by risk categories, search by identifiers, and export cohorts to CSV/JSON format.
            </p>
            <span className="text-xs font-semibold text-teal-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Open History <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 6 */}
          <div 
            onClick={() => setActivePage('report')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Vector Medical PDF Reports</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Generate hospital-grade clinical summary documents with patient encounter metadata, reference laboratory ranges, physician sign-off, and clean print styling.
            </p>
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Sample Report <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl shadow-blue-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Perform a Patient Risk Screening?
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Step through our clinical wizard in under 2 minutes or load a pre-configured clinical profile to evaluate coronary risk immediately.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActivePage('predict')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition cursor-pointer"
              >
                Start Patient Assessment
              </button>
              <button
                onClick={() => setActivePage('history')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/30 font-semibold text-sm transition cursor-pointer"
              >
                Browse Patient History
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


