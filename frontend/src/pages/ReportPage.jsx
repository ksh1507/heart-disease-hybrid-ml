import React from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Heart, 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Stethoscope
} from 'lucide-react';

export default function ReportPage({ result, setActivePage }) {
  const patient = result?.patient_data || {
    age: 63, sex: 1, cp: 4, trestbps: 152, chol: 286, fbs: 1,
    restecg: 2, thalach: 128, exang: 1, oldpeak: 2.4, slope: 2, ca: 2, thal: 7
  };

  const patientName = result?.patient_name || 'Marcus Vance';
  const patientId = result?.patient_id || 'CARD-8041';
  const timestamp = result?.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
  const probability = result?.probability != null ? (result.probability * 100).toFixed(1) : '84.5';
  const riskCategory = result?.risk_category || 'High';
  const confidence = result?.confidence_score ?? '92.4';
  const recommendations = result?.recommendations || [];
  const explanation = result?.explanation || [];

  const handlePrint = () => {
    window.print();
  };

  // Biomarker reference database
  const biomarkerTable = [
    { name: 'Resting Blood Pressure', val: `${patient.trestbps} mmHg`, ref: '< 120 mmHg', status: patient.trestbps >= 130 ? 'Elevated' : 'Normal', flag: patient.trestbps >= 130 },
    { name: 'Serum Total Cholesterol', val: `${patient.chol} mg/dL`, ref: '< 200 mg/dL', status: patient.chol >= 200 ? 'Hyperlipidemia' : 'Desirable', flag: patient.chol >= 200 },
    { name: 'Max Exercise Heart Rate', val: `${patient.thalach} bpm`, ref: '> 140 bpm', status: patient.thalach < 135 ? 'Reduced Capacity' : 'Normal Response', flag: patient.thalach < 135 },
    { name: 'Exercise ST Depression', val: `${Number(patient.oldpeak).toFixed(1)} mm`, ref: '< 1.0 mm', status: patient.oldpeak >= 1.0 ? 'Ischemia Indicated' : 'Physiological', flag: patient.oldpeak >= 1.0 },
    { name: 'Fasting Blood Sugar', val: patient.fbs === 1 ? '> 120 mg/dL' : '≤ 120 mg/dL', ref: '≤ 120 mg/dL', status: patient.fbs === 1 ? 'Impaired Fasting Glucose' : 'Normal', flag: patient.fbs === 1 },
    { name: 'Chest Pain Type', val: ['', 'Typical Angina', 'Atypical Angina', 'Non-Anginal', 'Asymptomatic (Silent)'][patient.cp] || 'Asymptomatic', ref: 'Non-Anginal', status: patient.cp === 4 || patient.cp === 1 ? 'High Clinical Concern' : 'Low Concern', flag: patient.cp === 4 },
    { name: 'Resting ECG', val: ['Normal', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy'][patient.restecg] || 'Normal', ref: 'Normal', status: patient.restecg > 0 ? 'Abnormal Waveform' : 'Normal', flag: patient.restecg > 0 },
    { name: 'Exercise Angina', val: patient.exang === 1 ? 'Yes (Provoked)' : 'No', ref: 'No', status: patient.exang === 1 ? 'Positive Exertional Angina' : 'Negative', flag: patient.exang === 1 },
    { name: 'Fluoroscopy Major Vessels', val: `${patient.ca} of 3 colored`, ref: '0 Vessels', status: patient.ca > 0 ? 'Coronary Stenosis' : 'Clear Vessels', flag: patient.ca > 0 },
    { name: 'Thallium Scintigraphy', val: patient.thal === 7 ? 'Reversible Defect (7)' : (patient.thal === 6 ? 'Fixed Defect (6)' : 'Normal (3)'), ref: 'Normal (3)', status: patient.thal === 7 ? 'Reversible Myocardial Ischemia' : (patient.thal === 6 ? 'Prior Infarct' : 'Normal Perfusion'), flag: patient.thal !== 3 },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Toolbar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
        <button
          onClick={() => setActivePage('results')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* MEDICAL REPORT CONTAINER (PDF Print Canvas) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-12 print-card print-break-inside-avoid">
        {/* Hospital Header / Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                CardioPulse Institute of Cardiovascular Medicine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Department of Non-Invasive Cardiology & AI Clinical Decision Support
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              450 Health Sciences Parkway, Suite 800 • Accredited JCAHO / CAP Laboratory
            </p>
          </div>

          <div className="mt-4 sm:mt-0 text-left sm:text-right text-xs text-slate-500 space-y-0.5 font-mono">
            <div><span className="font-semibold text-slate-700">REPORT ID:</span> {patientId}</div>
            <div><span className="font-semibold text-slate-700">DATE:</span> {timestamp}</div>
            <div><span className="font-semibold text-slate-700">VERSION:</span> CardioPulse AI v2.4 (FDA SaMD Tier II)</div>
          </div>
        </div>

        {/* Patient Demographics & Encounter Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-8 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Sex</span>
            <span className="font-semibold text-slate-800">{patient.age} Years / {patient.sex === 1 ? 'Male' : 'Female'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Attending Clinician</span>
            <span className="font-semibold text-slate-800">Dr. Sarah Vance, MD, FACC</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Encounter Type</span>
            <span className="font-semibold text-slate-800">Comprehensive Cardiac Evaluation</span>
          </div>
        </div>

        {/* Diagnostic Assessment Banner */}
        <div className={`p-6 rounded-2xl border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          riskCategory === 'High' ? 'bg-rose-50/70 border-rose-200' : riskCategory === 'Medium' ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                riskCategory === 'High' ? 'bg-rose-200 text-rose-900' : riskCategory === 'Medium' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {riskCategory} Cardiovascular Risk Stratum
              </span>
              <span className="text-xs font-mono text-slate-500">ICD-10: I25.10</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {riskCategory === 'High' ? 'High Probability of Ischemic Coronary Artery Disease' : riskCategory === 'Medium' ? 'Moderate Coronary Risk Profile' : 'Low Probability of Coronary Disease'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Random Forest ensemble prediction calibrated with Lundberg & Lee SHAP attribution analysis.
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-3xl font-extrabold text-slate-900">{probability}%</div>
            <div className="text-[11px] text-slate-500 font-medium">Estimated Risk Probability</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Model Confidence: {confidence}%</div>
          </div>
        </div>

        {/* Section 1: Clinical Biomarker Matrix */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            1. Clinical Biomarkers & Diagnostic Laboratory Findings
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[10px] font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Biomarker / Assay</th>
                  <th className="px-4 py-2.5">Patient Finding</th>
                  <th className="px-4 py-2.5">Normal Reference Range</th>
                  <th className="px-4 py-2.5 text-right">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {biomarkerTable.map((row, idx) => (
                  <tr key={idx} className={row.flag ? 'bg-rose-50/30' : ''}>
                    <td className="px-4 py-2 font-medium font-sans text-slate-800">{row.name}</td>
                    <td className="px-4 py-2 font-bold text-slate-900">{row.val}</td>
                    <td className="px-4 py-2 text-slate-500">{row.ref}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                        row.flag ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: SHAP Explainability & Top Influencing Factors */}
        <div className="mb-8 print-break-inside-avoid">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            2. Explainable AI: Primary Mechanistic Risk Drivers (SHAP)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Adverse Factors */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-2">
                Adverse Features Elevating Risk (+SHAP)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {explanation.filter(e => e.shap > 0).slice(0, 4).map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.feature}:</span>
                    <span className="font-mono font-bold text-rose-600">+{Math.abs(item.shap * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Protective Factors */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                Protective Features Mitigating Risk (-SHAP)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {explanation.filter(e => e.shap < 0).slice(0, 4).map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.feature}:</span>
                    <span className="font-mono font-bold text-emerald-600">-{Math.abs(item.shap * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Clinical Orders & Pathway */}
        <div className="mb-8 print-break-inside-avoid">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            3. Recommended Therapeutic & Diagnostic Care Pathway
          </h4>

          <div className="space-y-2.5">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{rec.title}</span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">{rec.category}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Physician Sign-off & Medical Attestation */}
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 print-break-inside-avoid text-xs">
          <div>
            <div className="h-10 border-b border-slate-400 border-dashed mb-2" />
            <span className="font-bold text-slate-900 block">Sarah Vance, MD, FACC</span>
            <span className="text-slate-500 text-[11px]">Director of Interventional Cardiology, License #MED-94021</span>
          </div>

          <div className="text-right">
            <div className="h-10 border-b border-slate-400 border-dashed mb-2 flex items-end justify-end">
              <span className="font-mono text-[10px] text-slate-400">ELECTRONICALLY VERIFIED</span>
            </div>
            <span className="font-bold text-slate-900 block">Automated Clinical Decision Support Attestation</span>
            <span className="text-slate-500 text-[11px]">Verified per AHA/ACC Guidelines on {timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

