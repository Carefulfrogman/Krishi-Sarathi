import React, { useState } from 'react';
import Icon from '../components/Icons';

export const Rewards = () => {
  const [points, setPoints] = useState(1250);

  const claimReward = (cost, name) => {
    if (points >= cost) {
      setPoints(points - cost);
      alert(`Successfully redeemed: ${name}!`);
    } else {
      alert('Insufficient Eco-Points for this reward.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-amber-600 to-emerald-700 text-white rounded-2xl border border-amber-500 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge bg-white/20 text-white border border-white/30">
            Regenerative Incentives
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Eco-Rewards & Point Ledger</h1>
          <p className="text-xs text-slate-100 mt-1">
            Earn points for maintaining high ESG ratings, zero pesticide usage, and solar drip irrigation.
          </p>
        </div>

        <div className="px-5 py-3 bg-white text-emerald-900 rounded-2xl shadow-lg text-right">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Available Eco-Points</div>
          <div className="text-2xl font-black text-emerald-700">{points.toLocaleString()} PTS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="eco-card bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Icon name="sprout" size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Bio-Fertilizer Voucher</h3>
          <p className="text-xs text-slate-500">$50 Voucher for organic vermicompost & solar biochar input.</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-black text-emerald-700">400 PTS</span>
            <button
              onClick={() => claimReward(400, '$50 Bio-Fertilizer Voucher')}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
            >
              Redeem
            </button>
          </div>
        </div>

        <div className="eco-card bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Icon name="droplet" size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Solar Drip Irrigation Subsidy</h3>
          <p className="text-xs text-slate-500">20% discount on solar-powered micro-irrigation pump kits.</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-black text-sky-700">800 PTS</span>
            <button
              onClick={() => claimReward(800, 'Solar Drip Subsidy')}
              className="px-3 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition"
            >
              Redeem
            </button>
          </div>
        </div>

        <div className="eco-card bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Icon name="award" size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero-Carbon Pioneer Badge</h3>
          <p className="text-xs text-slate-500">Gold Verified Badge displayed on all marketplace listings.</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-black text-amber-700">1,000 PTS</span>
            <button
              onClick={() => claimReward(1000, 'Zero-Carbon Pioneer Badge')}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition"
            >
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
