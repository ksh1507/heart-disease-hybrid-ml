import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function RocCurve({ rocCurves = {} }) {
  const [selectedModel, setSelectedModel] = useState('all');

  const rf = rocCurves.random_forest || {
    auc: 0.924,
    color: '#2563eb',
    points: [
      { fpr: 0.0, tpr: 0.0 }, { fpr: 0.02, tpr: 0.38 }, { fpr: 0.05, tpr: 0.62 },
      { fpr: 0.08, tpr: 0.79 }, { fpr: 0.12, tpr: 0.88 }, { fpr: 0.18, tpr: 0.93 },
      { fpr: 0.25, tpr: 0.96 }, { fpr: 0.40, tpr: 0.98 }, { fpr: 1.0, tpr: 1.0 },
    ],
  };

  const svm = rocCurves.svm || {
    auc: 0.891,
    color: '#0ea5e9',
    points: [
      { fpr: 0.0, tpr: 0.0 }, { fpr: 0.04, tpr: 0.30 }, { fpr: 0.08, tpr: 0.55 },
      { fpr: 0.14, tpr: 0.75 }, { fpr: 0.20, tpr: 0.84 }, { fpr: 0.30, tpr: 0.90 },
      { fpr: 0.50, tpr: 0.95 }, { fpr: 1.0, tpr: 1.0 },
    ],
  };

  const qsvm = rocCurves.quantum_svm || {
    auc: 0.732,
    color: '#8b5cf6',
    points: [
      { fpr: 0.0, tpr: 0.0 }, { fpr: 0.10, tpr: 0.25 }, { fpr: 0.20, tpr: 0.48 },
      { fpr: 0.35, tpr: 0.65 }, { fpr: 0.50, tpr: 0.78 }, { fpr: 0.70, tpr: 0.88 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  };

  // SVG coordinate transformation (0-1 to viewBox dimensions 40-280 x and 240-20 y)
  const toSvgX = (fpr) => 40 + fpr * 240;
  const toSvgY = (tpr) => 240 - tpr * 220;

  const pointsToPath = (points) => {
    return points.reduce((acc, curr, index) => {
      const x = toSvgX(curr.fpr);
      const y = toSvgY(curr.tpr);
      return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-slate-900">ROC Curve Performance Comparison</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sensitivity (TPR) vs 1 - Specificity (FPR) across varying decision thresholds.
          </p>
        </div>

        {/* Model Selector Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setSelectedModel('all')}
            className={`px-2.5 py-1 rounded transition ${selectedModel === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            All Models
          </button>
          <button
            onClick={() => setSelectedModel('rf')}
            className={`px-2.5 py-1 rounded transition ${selectedModel === 'rf' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Random Forest
          </button>
          <button
            onClick={() => setSelectedModel('svm')}
            className={`px-2.5 py-1 rounded transition ${selectedModel === 'svm' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600'}`}
          >
            SVM
          </button>
          <button
            onClick={() => setSelectedModel('qsvm')}
            className={`px-2.5 py-1 rounded transition ${selectedModel === 'qsvm' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Quantum SVM
          </button>
        </div>
      </div>

      {/* SVG ROC Plot */}
      <div className="relative w-full max-w-lg mx-auto aspect-[4/3]">
        <svg viewBox="0 0 300 270" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((val, i) => (
            <g key={i}>
              {/* Horizontal grid line */}
              <line
                x1="40"
                y1={toSvgY(val)}
                x2="280"
                y2={toSvgY(val)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text x="32" y={toSvgY(val) + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
                {val.toFixed(2)}
              </text>
              {/* Vertical grid line */}
              <line
                x1={toSvgX(val)}
                y1="20"
                x2={toSvgX(val)}
                y2="240"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text x={toSvgX(val)} y="254" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                {val.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Random guess baseline (diagonal) */}
          <line
            x1="40"
            y1="240"
            x2="280"
            y2="20"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Curves */}
          {(selectedModel === 'all' || selectedModel === 'qsvm') && (
            <path
              d={pointsToPath(qsvm.points)}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={selectedModel === 'qsvm' ? '3' : '2'}
              className="transition-all duration-300"
            />
          )}

          {(selectedModel === 'all' || selectedModel === 'svm') && (
            <path
              d={pointsToPath(svm.points)}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={selectedModel === 'svm' ? '3' : '2'}
              className="transition-all duration-300"
            />
          )}

          {(selectedModel === 'all' || selectedModel === 'rf') && (
            <path
              d={pointsToPath(rf.points)}
              fill="none"
              stroke="#2563eb"
              strokeWidth={selectedModel === 'rf' ? '3.5' : '2.5'}
              className="transition-all duration-300"
            />
          )}

          {/* Axis Labels */}
          <text x="160" y="268" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">
            False Positive Rate (1 - Specificity)
          </text>
          <text
            x="-130"
            y="14"
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[10px] fill-slate-500 font-medium"
          >
            True Positive Rate (Sensitivity)
          </text>
        </svg>
      </div>

      {/* Model AUC Legend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="font-semibold text-slate-800">Random Forest</span>
          </div>
          <span className="font-mono font-bold text-blue-700">AUC {rf.auc}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50/60 border border-sky-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="font-semibold text-slate-800">SVM (RBF)</span>
          </div>
          <span className="font-mono font-bold text-sky-700">AUC {svm.auc}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/60 border border-purple-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="font-semibold text-slate-800">Quantum SVM</span>
          </div>
          <span className="font-mono font-bold text-purple-700">AUC {qsvm.auc}</span>
        </div>
      </div>
    </div>
  );
}


