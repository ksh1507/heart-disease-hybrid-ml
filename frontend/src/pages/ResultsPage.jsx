import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Sliders, 
  ArrowRight, 
  Bookmark, 
  Share2, 
  Sparkles,
  Heart,
  ChevronRight,
  Download
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';

export default function ResultsPage({ 
  result, 
  setActivePage, 
  onSaveToHistory,
  historySaved 
}) {
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Assessment Active</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Please run a patient screening via the Clinical Wizard or load a sample preset case.
        </p>
        <button
          onClick={() => setActivePage('predict')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
        >
          Launch Clinical Wizard
        </button>
      </div>
    );
  }

  const {
    patient_id,
    patient_name,
    timestamp,
    probability,
    risk_percentage,
    risk_category,
    confidence_score,
    recommendations = [],
    patient_data = {},
  } = result;

  const isHighRisk = risk_category === 'High';
  const isMedRisk = risk_category === 'Medium';

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Patient Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${
              isHighRisk ? 'bg-rose-600' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
          >
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{patient_name || 'Anonymous Patient'}</h2>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {patient_id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Encounter recorded on {timestamp} • Assessment: Random Forest Tree Ensemble v1.6
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onSaveToHistory}
            disabled={historySaved}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              historySaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{historySaved ? 'Saved to Audit' : 'Save to History'}</span>
          </button>

          <button
            onClick={() => setActivePage('report')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gauge & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Col 1: Semicircular Risk Gauge Component */}
        <div className="lg:col-span-1">
          <RiskGauge
            percentage={risk_percentage}
            riskCategory={risk_category}
            confidenceScore={confidence_score}
          />
        </div>

        {/* Col 2 & 3: Clinical Findings & Risk Classification Details */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Diagnostic Synthesis</h3>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  isHighRisk
                    ? 'bg-rose-100 text-rose-800'
                    : isMedRisk
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {risk_category} Risk Stratum
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {result.human_explanation || (
                  `Based on the patient's multi-parametric clinical indicators, the model estimated a ${risk_percentage}% probability of coronary artery disease. Review prioritized recommendations below.`
                )}
              </p>

              {/* Key biomarker tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  BP: {patient_data.trestbps} mmHg
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  Cholesterol: {patient_data.chol} mg/dL
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  Max HR: {patient_data.thalach} bpm
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  ST Dep: {patient_data.oldpeak} mm
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  Fluoroscopy Vessels: {patient_data.ca}
                </span>
              </div>
            </div>
          </div>

          {/* Forward link to Explainable AI & Simulator */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Want to see why the AI made this prediction?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('explainable')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View SHAP Attribution</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setActivePage('explainable')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tailored Clinical Recommendations</h3>
            <p className="text-xs text-slate-500">Actionable guidance grouped by urgency per ACC/AHA guidelines.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 font-mono">{recommendations.length} Orders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => {
            const isHigh = rec.urgency === 'high';
            const isMedium = rec.urgency === 'medium';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition bg-white shadow-xs ${
                  isHigh ? 'border-rose-200' : isMedium ? 'border-amber-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {rec.urgency} Urgency
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


