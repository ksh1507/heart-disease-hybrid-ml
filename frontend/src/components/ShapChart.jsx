import React, { useState } from 'react';
import { Info, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export default function ShapChart({ explanation = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [filterDirection, setFilterDirection] = useState('all'); // all, risk_increasing, protective

  const items = showAll ? explanation : explanation.slice(0, 7);

  const filteredItems = items.filter(item => {
    if (filterDirection === 'risk_increasing') return item.shap > 0;
    if (filterDirection === 'protective') return item.shap < 0;
    return true;
  });

  // Find max absolute shap for bar normalization
  const maxAbsShap = Math.max(...explanation.map(e => e.absolute_shap || Math.abs(e.shap)), 0.05);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-slate-900">SHAP Feature Attribution (Local Explainability)</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quantifies how each patient biomarker shifted the AI model prediction away from the population baseline.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilterDirection('all')}
            className={`px-2.5 py-1 rounded-md transition ${filterDirection === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Factors
          </button>
          <button
            onClick={() => setFilterDirection('risk_increasing')}
            className={`px-2.5 py-1 rounded-md transition ${filterDirection === 'risk_increasing' ? 'bg-rose-50 text-rose-700 font-semibold shadow-sm' : 'text-slate-600 hover:text-rose-600'}`}
          >
            Adverse (+)
          </button>
          <button
            onClick={() => setFilterDirection('protective')}
            className={`px-2.5 py-1 rounded-md transition ${filterDirection === 'protective' ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' : 'text-slate-600 hover:text-emerald-600'}`}
          >
            Protective (-)
          </button>
        </div>
      </div>

      {/* Legend & Guide */}
      <div className="flex items-center justify-between text-xs py-3 text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Elevates Cardiac Risk (+SHAP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>Protective Biomarker (-SHAP)</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">TreeExplainer v0.42</span>
      </div>

      {/* Feature Bars */}
      <div className="space-y-3.5 mt-2">
        {filteredItems.map((item, idx) => {
          const isRisk = item.shap > 0;
          const barWidthPercent = Math.min(100, (Math.abs(item.shap) / maxAbsShap) * 100);
          const impactPercent = (item.shap * 100).toFixed(1);

          return (
            <div key={idx} className="group relative">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{item.feature}</span>
                  <span className="text-slate-400 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.feature_detail || `Value: ${item.value}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono font-semibold">
                  {isRisk ? (
                    <span className="text-rose-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{impactPercent}%
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {impactPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex items-center">
                {isRisk ? (
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                ) : (
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle View More */}
      {explanation.length > 7 && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            {showAll ? 'Show Top Key Drivers Only' : `View All ${explanation.length} Feature Factors`}
          </button>
        </div>
      )}
    </div>
  );
}


