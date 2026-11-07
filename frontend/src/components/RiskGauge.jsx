import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function RiskGauge({ percentage = 0, riskCategory = 'Low', confidenceScore = 90 }) {
  // Clamp between 0 and 100
  const clamped = Math.max(0, Math.min(100, percentage));
  
  // Angle for semicircular gauge: 0% = -90deg, 100% = +90deg
  const angle = (clamped / 100) * 180 - 90;

  const getColors = () => {
    if (clamped >= 70) {
      return {
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: ShieldAlert,
        glow: 'shadow-rose-100',
        label: 'High Risk Alert',
      };
    }
    if (clamped >= 40) {
      return {
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        glow: 'shadow-amber-100',
        label: 'Moderate Risk',
      };
    }
    return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle,
      glow: 'shadow-emerald-100',
      label: 'Optimal / Low Risk',
    };
  };

  const style = getColors();
  const Icon = style.icon;

  return (
    <div className={`p-6 rounded-2xl bg-white border ${style.border} shadow-sm relative overflow-hidden flex flex-col items-center text-center`}>
      {/* Background radial highlight */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${clamped >= 70 ? 'bg-rose-400' : clamped >= 40 ? 'bg-amber-400' : 'bg-emerald-400'}`} />

      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Cardiovascular Risk Metric</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.badge}`}>
          <Icon className="w-3.5 h-3.5" />
          {riskCategory} Risk
        </span>
      </div>

      {/* SVG Semicircle Gauge */}
      <div className="relative w-64 h-36 flex items-end justify-center my-2">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background track arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active colored gradient arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251.3"
            strokeDashoffset={251.3 - (251.3 * (clamped / 100))}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Tick markers */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = (tick / 100) * Math.PI;
            const x1 = 100 - 87 * Math.cos(tickAngle);
            const y1 = 100 - 87 * Math.sin(tickAngle);
            const x2 = 100 - 93 * Math.cos(tickAngle);
            const y2 = 100 - 93 * Math.sin(tickAngle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Center Pivot Point */}
          <circle cx="100" cy="100" r="8" fill="#1e293b" />
          <circle cx="100" cy="100" r="4" fill="#ffffff" />

          {/* Needle */}
          <g
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <polygon
              points="97,100 103,100 101,24 99,24"
              fill="#0f172a"
              filter="url(#needleShadow)"
            />
            <circle cx="100" cy="24" r="2.5" fill="#2563eb" />
          </g>
        </svg>

        {/* Floating Percentage in center */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className={`text-4xl font-extrabold tracking-tight ${style.text}`}>
            {clamped}%
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Risk Probability
          </span>
        </div>
      </div>

      {/* Threshold markings */}
      <div className="flex justify-between w-full text-[11px] font-medium text-slate-400 px-3 mt-1">
        <span className="text-emerald-600 font-semibold">0% Low</span>
        <span className="text-amber-600 font-semibold">40% Moderate</span>
        <span className="text-rose-600 font-semibold">70% High</span>
        <span>100%</span>
      </div>

      {/* Confidence Pill */}
      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
        <span className="text-slate-500">Model Confidence</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <span className="font-semibold text-slate-700">{confidenceScore}%</span>
        </div>
      </div>
    </div>
  );
}


