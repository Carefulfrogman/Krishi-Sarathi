import React, { useState } from 'react';
import Icon from '../components/Icons';
import CarbonCreditCard from '../components/CarbonCreditCard';
import { mockData } from '../services/api';

export const CarbonCredits = () => {
  const [stats] = useState(mockData.carbonCredits);
  const [estimating, setEstimating] = useState(false);
  const [estResult, setEstResult] = useState(null);

  const runSequestrationAI = () => {
    setEstimating(true);
    setTimeout(() => {
      setEstimating(false);
      setEstResult({
        additional_tonnage: 18.5,
        estimated_value: 453.25,
        confidence: '97.4% Satellite AI Verified',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 bg-bg-cream min-h-full p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-mountain-gray/20 shadow-sm">
        <div>
          <span className="px-2.5 py-1 bg-secondary-green/20 text-charcoal border border-secondary-green/30 rounded-full text-[11px] font-extrabold uppercase tracking-wider">Carbon Offset Ledger</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-3">Carbon Credit Portfolio</h1>
          <p className="text-xs text-mountain-gray mt-1">
            Track certified carbon sequestration metrics generated through sustainable farming.
          </p>
        </div>

        <button
          onClick={runSequestrationAI}
          disabled={estimating}
          className="px-4 py-2.5 bg-transparent border-2 border-primary-green hover:bg-primary-green text-primary-green hover:text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2"
        >
          <Icon name="refreshCw" size={16} className={estimating ? 'animate-spin' : ''} />
          {estimating ? 'Calculating Sequestration...' : 'Run AI Sequestration Estimator'}
        </button>
      </div>

      {estResult && (
        <div className="p-4 bg-secondary-green/10 border border-secondary-green/20 rounded-2xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-green text-white flex items-center justify-center font-bold">
              <Icon name="award" size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-primary-green">New Sequestration Target Identified!</div>
              <div className="text-xs text-soil-brown mt-0.5">
                Potential +{estResult.additional_tonnage} tCO₂e (~${estResult.estimated_value} USD) from biochar cover crops.
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-secondary-green/20 text-charcoal border border-secondary-green/30 rounded-full text-[10px] font-bold">{estResult.confidence}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CarbonCreditCard stats={stats} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-mountain-gray/20 shadow-sm p-6">
            <h3 className="text-base font-bold text-charcoal flex items-center gap-2 mb-4">
              <Icon name="fileText" size={18} className="text-primary-green" /> Issuance & Transaction Log
            </h3>

            <div className="overflow-x-auto border border-mountain-gray/15 rounded-xl">
              <table className="w-full text-xs text-left text-charcoal">
                <thead className="bg-bg-cream text-soil-brown uppercase font-bold text-[10px] border-b border-mountain-gray/15">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3">Credits Issued</th>
                    <th className="p-3">Verification Agency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mountain-gray/15">
                  <tr className="hover:bg-bg-cream/50 transition">
                    <td className="p-3 font-bold text-charcoal">Q1 2026 Cycle</td>
                    <td className="p-3 font-extrabold text-primary-green">48 tCO₂e</td>
                    <td className="p-3 text-mountain-gray">Krishi Saarathi AI Satellite Standard</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-secondary-green text-charcoal rounded-full text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-bg-cream/50 transition">
                    <td className="p-3 font-bold text-charcoal">Q4 2025 Cycle</td>
                    <td className="p-3 font-extrabold text-primary-green">52 tCO₂e</td>
                    <td className="p-3 text-mountain-gray">Verra Standard Registry</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-secondary-green text-charcoal rounded-full text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-bg-cream/50 transition">
                    <td className="p-3 font-bold text-charcoal">Q3 2025 Cycle</td>
                    <td className="p-3 font-extrabold text-primary-green">40 tCO₂e</td>
                    <td className="p-3 text-mountain-gray">Gold Standard Registry</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-secondary-green text-charcoal rounded-full text-[10px] font-bold">Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-mountain-gray/20 shadow-sm p-6">
            <h3 className="text-base font-bold text-charcoal flex items-center gap-2 mb-6">
              <Icon name="trendingUp" size={18} className="text-primary-green" /> 6-Month Sequestration Trend
            </h3>
            
            <div className="flex items-end gap-2 h-32 w-full mt-4 border-b border-mountain-gray/20 pb-2">
              {[
                { month: 'Oct', val: 30, height: '40%' },
                { month: 'Nov', val: 42, height: '60%' },
                { month: 'Dec', val: 38, height: '55%' },
                { month: 'Jan', val: 48, height: '70%' },
                { month: 'Feb', val: 56, height: '85%' },
                { month: 'Mar', val: 62, height: '100%' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="text-[10px] font-bold text-golden-harvest opacity-0 group-hover:opacity-100 transition mb-1">{bar.val} tCO₂e</div>
                  <div 
                    className="w-full max-w-[40px] bg-accent-green hover:bg-secondary-green rounded-t-md transition-all duration-300"
                    style={{ height: bar.height }}
                  ></div>
                  <div className="text-[10px] text-soil-brown font-bold mt-2">{bar.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCredits;
