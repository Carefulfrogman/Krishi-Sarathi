import React, { useState } from 'react';
import Icon from '../components/Icons';
import { mockData } from '../services/api';

export const SupplyChain = () => {
  const [batches] = useState(mockData.supplyChain);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge eco-badge-info">Logistics Provenance</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Supply Chain Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time shipment stages, environmental storage conditions, and buyer handovers.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {batches.map((b) => (
          <div key={b.batch_id} className="eco-card bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Batch Code: {b.batch_id}</span>
                <h3 className="text-lg font-bold text-slate-900">{b.crop_name}</h3>
                <p className="text-xs text-slate-500">{b.farm_name}</p>
              </div>
              <span className="eco-badge eco-badge-success text-xs">{b.stage}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Temperature</div>
                <div className="text-sm font-black text-slate-800">18.5 °C Optimal</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Humidity Control</div>
                <div className="text-sm font-black text-slate-800">45% Controlled</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase">GPS Tracking</div>
                <div className="text-sm font-black text-emerald-700">In Transit (Chitwan Depot)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase">QR Security</div>
                <div className="text-sm font-black text-slate-800">Tamper-Proof Lock</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplyChain;
