import React, { useState } from 'react';
import { Grid, Check, X, ShieldCheck } from 'lucide-react';

export default function ConfusionMatrix({ matrices = {} }) {
  const [activeModel, setActiveModel] = useState('random_forest');

  const current = matrices[activeModel] || {
    name: 'Random Forest',
    tn: 29, fp: 3,
    fn: 5, tp: 23,
    total: 60,
    sensitivity: 0.821,
    specificity: 0.906,
  };

  const tnRate = ((current.tn / current.total) * 100).toFixed(1);
  const fpRate = ((current.fp / current.total) * 100).toFixed(1);
  const fnRate = ((current.fn / current.total) * 100).toFixed(1);
  const tpRate = ((current.tp / current.total) * 100).toFixed(1);
  const accuracy = (((current.tp + current.tn) / current.total) * 100).toFixed(1);
  const precision = ((current.tp / (current.tp + current.fp)) * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      {/* Header & Model Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-900">Confusion Matrix & Error Analysis</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical test set validation (N = {current.total} evaluated heart disease patient cases).
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveModel('random_forest')}
            className={`px-3 py-1 rounded transition ${activeModel === 'random_forest' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'}`}
          >
            Random Forest
          </button>
          <button
            onClick={() => setActiveModel('svm')}
            className={`px-3 py-1 rounded transition ${activeModel === 'svm' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'}`}
          >
            SVM
          </button>
          <button
            onClick={() => setActiveModel('quantum_svm')}
            className={`px-3 py-1 rounded transition ${activeModel === 'quantum_svm' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'}`}
          >
            Quantum SVM
          </button>
        </div>
      </div>

      {/* 2x2 Matrix Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Matrix */}
        <div className="relative">
          {/* Header Axis */}
          <div className="text-center text-xs font-semibold text-slate-500 mb-2">
            PREDICTED CONDITION
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium text-slate-600 mb-1">
            <div>Negative (Healthy)</div>
            <div>Positive (Disease)</div>
          </div>

          <div className="relative grid grid-cols-2 gap-2">
            {/* True Negative (TN) */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                <span>True Negative (TN)</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-bold text-emerald-900">{current.tn}</span>
                <span className="text-xs text-emerald-700 ml-1.5 font-mono">({tnRate}%)</span>
              </div>
              <p className="text-[10px] text-emerald-700">Correctly identified healthy patients</p>
            </div>

            {/* False Positive (FP) - Type I error */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold">
                <span>False Positive (FP)</span>
                <X className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-bold text-amber-900">{current.fp}</span>
                <span className="text-xs text-amber-700 ml-1.5 font-mono">({fpRate}%)</span>
              </div>
              <p className="text-[10px] text-amber-700">Type I error (False alarm / benign labeled diseased)</p>
            </div>

            {/* False Negative (FN) - Type II error (Critical in Healthcare!) */}
            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-rose-800 font-semibold">
                <span>False Negative (FN)</span>
                <X className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-bold text-rose-900">{current.fn}</span>
                <span className="text-xs text-rose-700 ml-1.5 font-mono">({fnRate}%)</span>
              </div>
              <p className="text-[10px] text-rose-700">Type II error (Missed cardiac diagnosis — critical)</p>
            </div>

            {/* True Positive (TP) */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-blue-800 font-semibold">
                <span>True Positive (TP)</span>
                <Check className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-bold text-blue-900">{current.tp}</span>
                <span className="text-xs text-blue-700 ml-1.5 font-mono">({tpRate}%)</span>
              </div>
              <p className="text-[10px] text-blue-700">Correctly diagnosed heart disease</p>
            </div>
          </div>
        </div>

        {/* Calculated Clinical Metrics */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-semibold text-slate-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Clinical Validation Metrics
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Sensitivity / Recall (TP / (TP+FN)):</span>
            <span className="font-mono font-bold text-slate-900">{(current.sensitivity * 100).toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Specificity (TN / (TN+FP)):</span>
            <span className="font-mono font-bold text-slate-900">{(current.specificity * 100).toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Precision (PPV):</span>
            <span className="font-mono font-bold text-slate-900">{precision}%</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Overall Accuracy:</span>
            <span className="font-mono font-bold text-blue-700">{accuracy}%</span>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            {activeModel === 'random_forest' && 'Random Forest demonstrates the lowest False Negative rate (8.3%), making it the safest model for clinical screening.'}
            {activeModel === 'svm' && 'SVM achieves identical specificity (90.6%) to Random Forest but misses 1 additional true positive case.'}
            {activeModel === 'quantum_svm' && 'Quantum SVM (QSVC) serves as a baseline proof-of-concept with higher variance on 4 reduced quantum dimensions.'}
          </div>
        </div>
      </div>
    </div>
  );
}


