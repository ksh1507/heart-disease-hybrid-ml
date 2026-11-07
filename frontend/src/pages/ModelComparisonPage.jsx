import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Activity, 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Atom, 
  FileCode2,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import RocCurve from '../components/RocCurve';
import ConfusionMatrix from '../components/ConfusionMatrix';
import { getModelComparison } from '../services/api';

export default function ModelComparisonPage({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getModelComparison();
        setData(res);
      } catch (e) {
        console.error('Failed to load model comparison:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const models = data?.models || [
    { name: "Random Forest", accuracy: 0.8667, precision: 0.8846, recall: 0.8214, f1_score: 0.8519, badge: "Highest Accuracy", type: "Ensemble" },
    { name: "SVM", accuracy: 0.8500, precision: 0.8800, recall: 0.7857, f1_score: 0.8302, badge: "Balanced Precision", type: "RBF Kernel" },
    { name: "Quantum SVM (QSVC)", accuracy: 0.6667, precision: 0.6538, recall: 0.6071, f1_score: 0.6296, badge: "Quantum Enhanced", type: "ZZFeatureMap" }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Clinical ML & Quantum Machine Learning Benchmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Algorithm Comparison & Validation Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Rigorous benchmarking across classical ensembles, support vector machines, and Qiskit quantum statevector circuits.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {models.map((m, idx) => {
          const isRf = m.name.includes('Random');
          const isSvm = m.name === 'SVM' || m.name.includes('Support');
          const isQuantum = m.name.includes('Quantum') || m.name.includes('QSVC');

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white border transition relative overflow-hidden flex flex-col justify-between ${
                isRf ? 'border-blue-400 ring-2 ring-blue-100 shadow-md' : 'border-slate-200 shadow-xs'
              }`}
            >
              {isRf && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Production Gold Standard
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                      isRf ? 'bg-blue-600' : isSvm ? 'bg-sky-500' : 'bg-purple-600'
                    }`}
                  >
                    {isQuantum ? <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} /> : <Cpu className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                    <p className="text-[11px] text-slate-500">{m.type || 'Model'}</p>
                  </div>
                </div>

                {/* Main Metric: Accuracy */}
                <div className="my-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {(m.accuracy * 100).toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Test Accuracy</span>
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Precision (PPV):</span>
                      <span className="font-mono font-semibold text-slate-800">{(m.precision * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isRf ? 'bg-blue-600' : isSvm ? 'bg-sky-500' : 'bg-purple-600'}`}
                        style={{ width: `${m.precision * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Recall / Sensitivity:</span>
                      <span className="font-mono font-semibold text-slate-800">{(m.recall * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isRf ? 'bg-blue-600' : isSvm ? 'bg-sky-500' : 'bg-purple-600'}`}
                        style={{ width: `${m.recall * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">F1 Score (Harmonic Mean):</span>
                      <span className="font-mono font-semibold text-slate-800">{(m.f1_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isRf ? 'bg-blue-600' : isSvm ? 'bg-sky-500' : 'bg-purple-600'}`}
                        style={{ width: `${m.f1_score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                {isRf && 'Lowest False Negative rate with optimal non-linear boundary handling.'}
                {isSvm && 'Radial Basis Function kernel mapping with strong margin separation.'}
                {isQuantum && 'ZZFeatureMap (reps=2, linear) with 4-qubit quantum state simulation.'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Visualizations: ROC Curves & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ROC Curves Component */}
        <RocCurve rocCurves={data?.roc_curves} />

        {/* Confusion Matrix Component */}
        <ConfusionMatrix matrices={data?.confusion_matrices} />
      </div>

      {/* Quantum Machine Learning (QSVC) Architectural Deep-Dive */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Quantum ambient lights */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl -z-0" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <Atom className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              Experimental Hybrid Architecture
            </span>
          </div>

          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              Quantum Kernel Estimation via Qiskit & ZZFeatureMap
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In addition to classical Random Forest, our research engine benchmarks Quantum Support Vector Classifiers (QSVC). Biomarkers are normalized and mapped into a 4-qubit Hilbert space using Qiskit's <code className="text-purple-300 bg-purple-950 px-1 py-0.5 rounded font-mono text-[11px]">ZZFeatureMap</code> with 2 repetitions and linear entanglement.
            </p>
          </div>

          {/* Architecture comparison grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-purple-300 text-[11px] font-semibold block mb-1">State Embedding</span>
              <p className="font-mono text-slate-200">{String.raw`|\psi(x)\rangle = U_{\Phi(x)} |0\rangle^{\otimes n}`}</p>
              <p className="text-[11px] text-slate-400 mt-2">Projects patient biomarkers into a 2^4 = 16-dimensional quantum state space.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-purple-300 text-[11px] font-semibold block mb-1">Quantum Kernel Matrix</span>
              <p className="font-mono text-slate-200">{String.raw`K_{ij} = |\langle\psi(x_i)|\psi(x_j)\rangle|^2`}</p>
              <p className="text-[11px] text-slate-400 mt-2">Calculates transition probabilities via Statevector simulator inner products.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-purple-300 text-[11px] font-semibold block mb-1">Dual Solver</span>
              <p className="font-mono text-slate-200">{String.raw`\max_\alpha \sum \alpha_i - \frac{1}{2}\sum \alpha_i\alpha_j y_i y_j K_{ij}`}</p>
              <p className="text-[11px] text-slate-400 mt-2">Classical convex quadratic program optimizes hyperplane margins over the quantum kernel.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Conclusion: Classical Random Forest achieves superior clinical recall (82.1% vs 60.7%), but QSVC demonstrates quantum kernel feasibility.
            </span>
            <button
              onClick={() => setActivePage('predict')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Test Current Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


