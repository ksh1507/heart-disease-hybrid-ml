import React from 'react';
import { Heart, ShieldCheck, Lock, Award, FileCode2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Description */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">CardioPulse AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clinical decision support platform combining Random Forest ensembles, Explainable AI (SHAP), and experimental Quantum Support Vector Classifiers.
            </p>
            <div className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} CardioPulse Health Technologies.
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Clinical Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setActivePage('predict')} className="hover:text-blue-600 cursor-pointer">
                  Prediction Wizard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('explainable')} className="hover:text-blue-600 cursor-pointer">
                  SHAP Explainability
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('models')} className="hover:text-blue-600 cursor-pointer">
                  Quantum & Classical Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-blue-600 cursor-pointer">
                  Patient Audit Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical & Algorithmic Specs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">AI Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Random Forest (100 Trees)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-sky-500" />
                <span>RBF Support Vector Machine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Qiskit ZZFeatureMap QSVC</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Lundberg & Lee SHAP 0.42</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Certifications */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Compliance & Ethics</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>HIPAA / HITECH Secure Cloud</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>256-bit AES Patient Encryption</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>FDA SaMD Research Guidelines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-slate-500">Clinical Disclaimer:</span> CardioPulse AI is engineered for investigational, educational, and physician decision-support purposes. It does not replace individualized clinical judgment, physical examination, or diagnostic angiography. All therapeutic interventions must be validated by a licensed physician.
          </p>
        </div>
      </div>
    </footer>
  );
}


