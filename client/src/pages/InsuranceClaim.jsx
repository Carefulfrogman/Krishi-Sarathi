import React, { useState } from 'react';
import Icon from '../components/Icons';
import InsuranceStatus from '../components/InsuranceStatus';
import { insuranceService, mockData } from '../services/api';

export const InsuranceClaim = () => {
  const [insurance, setInsurance] = useState(mockData.insurance);
  const [formData, setFormData] = useState({
    hazard: 'Localized Hailstorm Damage',
    amount: 1500,
    farm_id: 'f-101',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await insuranceService.submitClaim(formData);
      alert(`Claim ${res.id} submitted! Satellite damage detection engine has verified the event.`);
      setInsurance({
        ...insurance,
        active_claims: [res, ...insurance.active_claims],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge eco-badge-info">Satellite Parametric Protection</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Parametric Crop Insurance Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated weather hazard verification using satellite thermal and precipitation telemetry.
          </p>
        </div>

        <div className="px-4 py-2 bg-sky-50 rounded-xl border border-sky-200 text-right">
          <div className="text-[10px] text-sky-800 font-semibold uppercase">Active Policy</div>
          <div className="text-lg font-black text-sky-900">$15,000 Total Coverage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <InsuranceStatus insurance={insurance} />
        </div>

        <div className="md:col-span-2 eco-card bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="plus" size={18} className="text-sky-600" /> File Parametric Damage Claim
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hazard / Weather Event</label>
              <select
                value={formData.hazard}
                onChange={(e) => setFormData({ ...formData, hazard: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-semibold"
              >
                <option value="Localized Hailstorm Damage">Localized Hailstorm Damage</option>
                <option value="Unseasonal Flash Flood">Unseasonal Flash Flood</option>
                <option value="Severe Drought Spurt">Severe Drought Spurt</option>
                <option value="Pest Infestation Outbreak">Pest Infestation Outbreak</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affected Farm Plot</label>
                <select
                  value={formData.farm_id}
                  onChange={(e) => setFormData({ ...formData, farm_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                >
                  <option value="f-101">Green Horizon Eco Farm (Chitwan)</option>
                  <option value="f-102">Sunrise Agro Fields (Pokhara)</option>
                  <option value="f-103">Himalayan Organic Orchards (Mustang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Loss Amount ($ USD)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field Damage Description</label>
              <textarea
                rows="3"
                placeholder="Describe visible crop damage, waterlogging level, or foliage degradation..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="shield" size={16} />
              {submitting ? 'Verifying with Satellite Radar...' : 'Submit Claim for Instant AI Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaim;
