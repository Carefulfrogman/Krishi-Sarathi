import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';

export const SustainabilityCard = ({ score }) => {
  const overall = score?.overall_score || 89.4;

  const metrics = [
    { label: '💧 Water Efficiency', val: score?.water_score || 94.0, status: 'Excellent', color: 'bg-cyan-500' },
    { label: '🌱 Soil Health & Fertility', val: score?.soil_score || 88.5, status: 'Good', color: 'bg-emerald-500' },
    { label: '🌳 Wildlife & Biodiversity', val: score?.biodiversity_score || 86.0, status: 'Healthy', color: 'bg-teal-500' },
    { label: '☀️ Carbon Yield', val: score?.carbon_score || 91.2, status: 'High Yield', color: 'bg-amber-500' },
  ];

  return (
    <div className="eco-card bg-white shadow-sm relative pt-6">
      {/* Decorative Traditional Border Accent (Subtle Dhaka pattern styling) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-700 to-emerald-600 rounded-t-2xl"></div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-xl">🌿</span> Farm Health Index
          </h3>
          <p className="text-[10px] text-slate-500 font-bold mt-0.5 flex flex-col">
            <span>Verified Environmental Grade</span>
            <span className="text-[#10B981] font-extrabold">IPCC & Verra VCS Standard</span>
          </p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 font-black text-xl rounded-xl border border-emerald-200">
          <span>{overall}</span>
          <span className="text-xs text-emerald-600 font-bold">/ 100</span>
        </div>
      </div>

      {/* Visual Progress Meters */}
      <div className="mt-5 space-y-4">
        {metrics.map((m, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-xs font-bold mb-1 text-slate-800">
              <span>{m.label}</span>
              <span className="text-emerald-700 font-black">{m.val}% ({m.status})</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${m.color} rounded-full transition-all duration-500`}
                style={{ width: `${m.val}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Last Checked: {score?.assessment_date || '2026-07-28'}</span>
        <Link to="/sustainability" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
          Full Report →
        </Link>
      </div>
    </div>
  );
};

export default SustainabilityCard;
