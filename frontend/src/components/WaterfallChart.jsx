import React from 'react';
import { GitCommit, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function WaterfallChart({ waterfall = [], baseValue = 0.4656, finalProbability = 0.85 }) {
  if (!waterfall || waterfall.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-900">SHAP Waterfall Risk Decomposition</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracks how the model moves step-by-step from prior baseline to the final patient prediction probability.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono text-slate-700">
            E[f(x)] Base: {(baseValue * 100).toFixed(1)}%
          </span>
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md font-mono font-semibold">
            f(x) Final: {(finalProbability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Waterfall steps list */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {waterfall.map((step, idx) => {
          const isBaseline = step.type === 'baseline';
          const isFinal = step.type === 'final';
          const isPositive = step.type === 'positive';
          const isNegative = step.type === 'negative';

          return (
            <div key={idx} className="relative flex items-center justify-between group">
              {/* Timeline node */}
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                  isBaseline
                    ? 'border-slate-400 text-slate-600'
                    : isFinal
                    ? 'border-blue-600 text-blue-600 ring-4 ring-blue-50'
                    : isPositive
                    ? 'border-rose-500 text-rose-500'
                    : 'border-emerald-500 text-emerald-500'
                }`}
              >
                {isFinal ? (
                  <CheckCircle2 className="w-3 h-3 fill-blue-600 text-white" />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBaseline ? 'bg-slate-400' : isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 pl-3 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      isFinal
                        ? 'font-bold text-blue-900 text-sm'
                        : isBaseline
                        ? 'font-semibold text-slate-700'
                        : 'font-medium text-slate-800'
                    }`}
                  >
                    {step.step}
                  </span>
                  {!isBaseline && !isFinal && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        isPositive ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {step.contribution > 0 ? `+${(step.contribution * 100).toFixed(1)}%` : `${(step.contribution * 100).toFixed(1)}%`}
                    </span>
                  )}
                </div>

                {/* Micro progression bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFinal
                        ? 'bg-blue-600'
                        : isPositive
                        ? 'bg-rose-500'
                        : isNegative
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, step.cumulative * 100))}%` }}
                  />
                </div>
              </div>

              {/* Cumulative Value Badge */}
              <div className="text-right">
                <span
                  className={`font-mono text-xs ${
                    isFinal
                      ? 'font-extrabold text-blue-600 text-sm'
                      : 'font-semibold text-slate-600'
                  }`}
                >
                  {(step.cumulative * 100).toFixed(1)}%
                </span>
                <p className="text-[10px] text-slate-400">cumulative</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


