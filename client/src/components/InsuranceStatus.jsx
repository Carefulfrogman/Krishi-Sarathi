import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';

export const InsuranceStatus = ({ insurance }) => {
  return (
    <div className="eco-card bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Icon name="shield" size={20} className="text-sky-600" />
          Crop Insurance Policy
        </h3>
        <span className="eco-badge eco-badge-success">
          🛡️ Fully Protected
        </span>
      </div>

      <div className="mt-4 p-3.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-sky-800 font-bold uppercase">Policy ID</div>
          <div className="text-sm font-extrabold text-sky-950">{insurance?.policy_id || 'POL-2026-8841'}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-sky-800 font-bold uppercase">Total Coverage</div>
          <div className="text-base font-black text-sky-900">
            ${(insurance?.coverage_amount || 15000).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="mt-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Recent Weather Claims
        </div>
        {insurance?.active_claims?.map((claim) => (
          <div key={claim.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{claim.hazard}</span>
              <span className="text-emerald-700 font-black">${claim.claimed_amount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 mt-1 text-[11px]">
              <span>Date: {claim.date}</span>
              <span className="text-emerald-700 font-bold">✓ Approved</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to="/insurance"
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl transition inline-flex items-center justify-center gap-2 shadow-xs"
        >
          <Icon name="plus" size={16} /> Submit Damage Claim
        </Link>
      </div>
    </div>
  );
};

export default InsuranceStatus;
