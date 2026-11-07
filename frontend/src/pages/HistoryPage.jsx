import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  Eye, 
  FileText, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { getPredictionHistory } from '../services/api';

export default function HistoryPage({ onSelectPatientRecord, setActivePage }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sexFilter, setSexFilter] = useState('all');
  const [sortField, setSortField] = useState('Timestamp'); // 'Timestamp' | 'Probability' | 'Age'
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const records = await getPredictionHistory();
        setHistory(records);
      } catch (e) {
        console.error('Error fetching history:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter & Search
  const filtered = history.filter((r) => {
    const searchMatch = 
      (r.PatientID || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.PatientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.Prediction || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.KeyFactor || '').toLowerCase().includes(searchTerm.toLowerCase());

    const riskMatch = riskFilter === 'all' || (r.Risk || '').toLowerCase() === riskFilter.toLowerCase();
    const sexMatch = sexFilter === 'all' || (r.Sex || '').toLowerCase() === sexFilter.toLowerCase();

    return searchMatch && riskMatch && sexMatch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'Probability' || sortField === 'Age') {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    } else {
      aVal = String(aVal || '');
      bVal = String(bVal || '');
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = ['Timestamp', 'PatientID', 'PatientName', 'Age', 'Sex', 'Prediction', 'Probability', 'Risk', 'BloodPressure', 'Cholesterol', 'KeyFactor'];
    const rows = sorted.map(r => [
      `"${r.Timestamp || ''}"`,
      `"${r.PatientID || ''}"`,
      `"${r.PatientName || ''}"`,
      r.Age || '',
      `"${r.Sex || ''}"`,
      `"${r.Prediction || ''}"`,
      r.Probability || '',
      `"${r.Risk || ''}"`,
      r.BloodPressure || '',
      r.Cholesterol || '',
      `"${r.KeyFactor || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cardiopulse_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (sorted.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sorted, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `cardiopulse_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Longitudinal Patient Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Prediction History & Encounter Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, inspect past predictions, and export clinical datasets.
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient ID, Name, or Clinical Finding..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Risk Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="all">Risk Level: All Categories</option>
            <option value="high">High Risk (&ge;70%)</option>
            <option value="medium">Medium Risk (40-69%)</option>
            <option value="low">Low Risk (&lt;40%)</option>
          </select>
        </div>

        {/* Sex Filter */}
        <div>
          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="all">Sex: All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Patient Record</th>
                <th 
                  className="px-5 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    if (sortField === 'Timestamp') setSortAsc(!sortAsc);
                    else { setSortField('Timestamp'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="px-5 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    if (sortField === 'Age') setSortAsc(!sortAsc);
                    else { setSortField('Age'); setSortAsc(true); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Age / Sex</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="px-5 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    if (sortField === 'Probability') setSortAsc(!sortAsc);
                    else { setSortField('Probability'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Probability / Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-5 py-3">Vitals (BP/Chol)</th>
                <th className="px-5 py-3">Key Influencing Factor</th>
                <th className="px-5 py-3 text-right">Encounter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-400">
                    No patient records matched the specified filter criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => {
                  const isHigh = (row.Risk || '').toLowerCase() === 'high';
                  const isMed = (row.Risk || '').toLowerCase() === 'medium';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      {/* Patient ID & Name */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{row.PatientName || 'Anonymous'}</div>
                        <div className="font-mono text-[11px] text-slate-400">{row.PatientID || `CARD-${8000+idx}`}</div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {row.Timestamp}
                      </td>

                      {/* Age & Sex */}
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800">{row.Age} yo</span>
                        <span className="text-slate-400 ml-1">({row.Sex === 'Male' ? 'M' : 'F'})</span>
                      </td>

                      {/* Probability & Risk Badge */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isHigh
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isMed
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {row.Risk}
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {row.Probability}%
                          </span>
                        </div>
                      </td>

                      {/* Vitals */}
                      <td className="px-5 py-3.5 font-mono text-[11px]">
                        <div>BP: {row.BloodPressure || 130} mmHg</div>
                        <div className="text-slate-400">Chol: {row.Cholesterol || 220} mg/dL</div>
                      </td>

                      {/* Key Factor */}
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {row.KeyFactor || 'Multi-parametric elevation'}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (onSelectPatientRecord) onSelectPatientRecord(row);
                            setActivePage('report');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


