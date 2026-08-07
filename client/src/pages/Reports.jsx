import React from 'react';
import Icon from '../components/Icons';

export const Reports = () => {
  const handleExportPDF = () => {
    alert('Generating Krishi Saarathi ESG Sustainability Audit Report PDF...');
  };

  const handleExportCSV = () => {
    alert('Exporting Carbon Offsets & Farm Telemetry CSV...');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge eco-badge-success">Compliance & Audits</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">ESG & Sustainability Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Download certified environmental impact dossiers for regulatory, banking, or ESG investor compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Icon name="download" size={16} /> Export CSV Data
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="fileText" size={16} /> Generate PDF Dossier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="eco-card bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Icon name="fileText" size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">2026 Annual ESG Compliance Dossier</h3>
          <p className="text-xs text-slate-500">
            Includes verified water savings, carbon sequestration yield (140 tCO₂e), pesticide-free certification, and satellite canopy index.
          </p>
          <button onClick={handleExportPDF} className="text-xs font-bold text-emerald-600 hover:underline">
            Download Complete Audit Pack →
          </button>
        </div>

        <div className="eco-card bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Icon name="award" size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Carbon Offset Registry Statement</h3>
          <p className="text-xs text-slate-500">
            Formal transaction registry breakdown of all carbon credit sales, buyer details, and vintage verification badges.
          </p>
          <button onClick={handleExportCSV} className="text-xs font-bold text-amber-600 hover:underline">
            Export Transaction Ledger →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
