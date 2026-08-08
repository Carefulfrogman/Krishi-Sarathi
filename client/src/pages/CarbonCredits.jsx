import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import CarbonCreditCard from '../components/CarbonCreditCard';
import { mockData } from '../services/api';

export const CarbonCredits = () => {
  const [stats] = useState(mockData.carbonCredits);
  
  // State for Carbon Estimator Data (read from localStorage)
  const [carbonEstimate, setCarbonEstimate] = useState(null);

  // Government Verification State
  const [govtNotes, setGovtNotes] = useState('');
  const [submittingGovt, setSubmittingGovt] = useState(false);
  const [govtSubmission, setGovtSubmission] = useState(null);

  // Read saved estimator values & submission status on load
  useEffect(() => {
    try {
      const savedEst = localStorage.getItem('ecotrace_carbon_estimate');
      if (savedEst) {
        setCarbonEstimate(JSON.parse(savedEst));
      } else {
        // Fallback default sample from calculator
        setCarbonEstimate({
          farmName: 'Koshi Krishi Farm',
          location: 'Sunsari, Koshi Province',
          farmArea: '2.5',
          areaUnit: 'ha',
          estimatedCarbonBenefit: 14.85,
          calculatedAt: 'Aug 8, 2026',
          cropsCount: 2,
          treesCount: 45,
          tillage: 'zero',
          irrigation: 'solar',
        });
      }

      const savedGovt = localStorage.getItem('ecotrace_govt_verification');
      if (savedGovt) {
        setGovtSubmission(JSON.parse(savedGovt));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Handle Submission to Government Registry
  const handleSendToGovernment = (e) => {
    e.preventDefault();
    setSubmittingGovt(true);

    setTimeout(() => {
      const submissionData = {
        refId: `MOALD-REDD-2081-${Math.floor(Math.random() * 9000 + 1000)}`,
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agency: 'Nepal Ministry of Agriculture & REDD+ Secretariat (MoALD)',
        estimatedTons: carbonEstimate?.estimatedCarbonBenefit || 14.85,
        estimatedValueUsd: ((carbonEstimate?.estimatedCarbonBenefit || 14.85) * 25).toFixed(2),
        farmName: carbonEstimate?.farmName || 'Koshi Krishi Farm',
        location: carbonEstimate?.location || 'Sunsari, Nepal',
        notes: govtNotes || 'Expedited field verification requested for current crop cycle.',
        status: 'Submitted (Pending MoALD Field Audit)',
        statusNe: 'दर्ता भयो (सरकारी अनुगमनको पर्खाइमा)',
      };

      setGovtSubmission(submissionData);
      setSubmittingGovt(false);
      try {
        localStorage.setItem('ecotrace_govt_verification', JSON.stringify(submissionData));
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  const estTons = carbonEstimate?.estimatedCarbonBenefit || 14.85;
  const estUsd = (estTons * 25).toFixed(2);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-800 rounded-2xl shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-2">
            🌱 Carbon Credit Portfolio & Earnings
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Carbon Earnings & Government Registry
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Track your calculated carbon sequestration benefits, review market values, and send verified data to government authorities for credit certification.
          </p>
          <p className="text-teal-200 text-xs mt-0.5 max-w-xl font-medium">
            आफ्नो कार्बन आम्दानी हेर्नुहोस् र प्रमाणीकरणका लागि नेपाल सरकारलाई डेटा पठाउनुहोस्।
          </p>
        </div>

        <Link
          to="/sustainability"
          className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-2 backdrop-blur-xs min-w-[160px]"
        >
          <Icon name="refreshCw" size={16} /> Re-run Carbon Estimator
        </Link>
      </div>

      {/* ── SECTION 1: Value from Carbon Estimator ── */}
      <div className="eco-card border-sky-200 bg-gradient-to-br from-white to-sky-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
              <Icon name="award" size={22} />
            </div>
            <div>
              <span className="eco-badge eco-badge-info text-[9px] mb-1">Carbon Estimator Output</span>
              <h2 className="text-base font-extrabold text-slate-800">
                Latest Estimated Carbon Benefit / अनुमानित कार्बन लाभ
              </h2>
              <p className="text-xs text-slate-500">Value computed from your Sustainability & Carbon Estimator assessment</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-center">
            📅 Calculated: {carbonEstimate?.calculatedAt || 'Today'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Estimated Carbon Benefit</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {estTons} <span className="text-xs font-bold text-emerald-700">tCO₂e / year</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">वार्षिक कार्बन उत्सर्जन कटौती</div>
          </div>

          <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-100">
            <div className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider">Potential Market Earnings</div>
            <div className="text-2xl font-black text-sky-900 mt-1">
              ${estUsd} <span className="text-xs font-bold text-sky-700">USD</span>
            </div>
            <div className="text-[11px] text-sky-700 font-medium mt-0.5">अनुमानित बजार मूल्य (~$25/credit)</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Farm Source</div>
            <div className="text-sm font-extrabold text-slate-800 mt-1">{carbonEstimate?.farmName || 'Koshi Farm'}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{carbonEstimate?.location || 'Sunsari, Nepal'} ({carbonEstimate?.farmArea || '2.5'} {carbonEstimate?.areaUnit || 'ha'})</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Include: Zero Tillage ({carbonEstimate?.tillage || 'zero'}), Solar Irrigation, {carbonEstimate?.treesCount || 45} Trees</span>
          <Link to="/sustainability" className="text-sky-600 font-bold hover:underline">Recalculate in Estimator →</Link>
        </div>
      </div>

      {/* ── SECTION 2: Government Verification & Registration Form ── */}
      <div className="eco-card border-emerald-300 bg-gradient-to-br from-white to-emerald-50/30">
        <div className="flex items-start gap-4 mb-4">
          {/* Official Nepal Government Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/nepal-gov-emblem.png"
              alt="Government of Nepal Emblem"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.parentElement.innerHTML = '<span class="text-2xl">🏛️</span>';
              }}
            />
          </div>
          <div>
            <span className="eco-badge eco-badge-success text-[9px] mb-1">Official Registry Integration</span>
            <h2 className="text-lg font-extrabold text-slate-800">
              Send Data to Government for Verification
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Submit your calculated carbon benefit and field practice log to the <strong className="text-emerald-800">Ministry of Agriculture and Livestock Development (MoALD) & REDD+ Climate Secretariat, Nepal</strong> for official government audit and credit certification.
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              नेपाल सरकार कृषि तथा पशुपन्छी विकास मन्त्रालय र REDD+ जलवायु सचिवालयमा सरकारी प्रमाणीकरणका लागि पठाउनुहोस्।
            </p>
          </div>
        </div>

        {/* Existing Government Submission Status Banner if submitted */}
        {govtSubmission ? (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/nepal-gov-emblem.png"
                  alt="Nepal Government Logo"
                  className="w-10 h-10 object-contain shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className="text-xs font-extrabold text-emerald-900 uppercase flex items-center gap-1.5">
                    <span>✅</span> Government Submission Status
                  </div>
                  <div className="text-sm font-black text-emerald-800">{govtSubmission.status}</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800">
                Ref: {govtSubmission.refId}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Target Agency:</span>
                <span className="font-bold text-slate-800">{govtSubmission.agency}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Submitted Tonnage:</span>
                <span className="font-bold text-emerald-800">{govtSubmission.estimatedTons} tCO₂e / yr (${govtSubmission.estimatedValueUsd})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Submission Date:</span>
                <span className="font-bold text-slate-800">{govtSubmission.submittedAt}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <span className="font-bold">Next Steps:</span> An agricultural officer from your local Krishi Gyan Kendra will perform a satellite & field cross-verification within 10-14 business days.{' '}
              <span className="font-medium">स्थानीय कृषि ज्ञान केन्द्रका प्राविधिकद्वारा १०-१४ दिनभित्र अनुगमन गरिनेछ।</span>
            </div>

            <button
              onClick={() => {
                setGovtSubmission(null);
                localStorage.removeItem('ecotrace_govt_verification');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline pt-1"
            >
              Submit Updated Data to Government →
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSendToGovernment} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Government Agency / सरकारी निकाय
                </label>
                <input
                  type="text"
                  disabled
                  value="MoALD & REDD+ Climate Secretariat, Nepal (कृषि मन्त्रालय)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Carbon Benefit to Verify / प्रमाणीकरण गर्ने कार्बन
                </label>
                <input
                  type="text"
                  disabled
                  value={`${estTons} tCO₂e / year (~$${estUsd} USD)`}
                  className="w-full px-3 py-2 text-xs border border-emerald-200 rounded-xl bg-emerald-50 text-emerald-800 font-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Applicant Farm & Location / फारम र स्थान
                </label>
                <input
                  type="text"
                  disabled
                  value={`${carbonEstimate?.farmName || 'Koshi Krishi Farm'} (${carbonEstimate?.location || 'Sunsari'})`}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Verification Type / अनुगमन प्रकार
                </label>
                <select className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  <option value="standard">Satellite Remote Sensing + Krishi Gyan Kendra Field Audit</option>
                  <option value="expedited">Expedited Monitored Audit (Prime Minister PMAMP Project)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Farmer / Officer Remarks (optional) / विशेष टिप्पणी
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Requesting field verification for spring maize and solar drip irrigation install..."
                value={govtNotes}
                onChange={(e) => setGovtNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingGovt}
              className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submittingGovt ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Transmitting Data to Government Portal… / सरकारी पोर्टलमा डेटा पठाउँदै…
                </>
              ) : (
                <>
                  <span>🏛️</span> Send Data to Government for Verification / सरकारलाई प्रमाणीकरणको लागि पठाउनुहोस्
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* ── SECTION 3: Carbon Credits Balance & Transactions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CarbonCreditCard stats={stats} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-4">
              <Icon name="fileText" size={18} className="text-emerald-700" /> Issuance & Transaction Log
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3">Credits Issued</th>
                    <th className="p-3">Verification Agency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-800">Q1 2026 Cycle</td>
                    <td className="p-3 font-extrabold text-emerald-700">48 tCO₂e</td>
                    <td className="p-3 text-slate-600">MoALD Nepal Govt & REDD+ Cell</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">Government Verified</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-800">Q4 2025 Cycle</td>
                    <td className="p-3 font-extrabold text-emerald-700">52 tCO₂e</td>
                    <td className="p-3 text-slate-600">Verra Standard Registry</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-800">Q3 2025 Cycle</td>
                    <td className="p-3 font-extrabold text-emerald-700">40 tCO₂e</td>
                    <td className="p-3 text-slate-600">Gold Standard Registry</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-6">
              <Icon name="trendingUp" size={18} className="text-emerald-700" /> 6-Month Sequestration Trend
            </h3>
            
            <div className="flex items-end gap-2 h-32 w-full mt-4 border-b border-slate-200 pb-2">
              {[
                { month: 'Oct', val: 30, height: '40%' },
                { month: 'Nov', val: 42, height: '60%' },
                { month: 'Dec', val: 38, height: '55%' },
                { month: 'Jan', val: 48, height: '70%' },
                { month: 'Feb', val: 56, height: '85%' },
                { month: 'Mar', val: 62, height: '100%' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="text-[10px] font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition mb-1">{bar.val} tCO₂e</div>
                  <div 
                    className="w-full max-w-[40px] bg-emerald-400 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
                    style={{ height: bar.height }}
                  ></div>
                  <div className="text-[10px] text-slate-600 font-bold mt-2">{bar.month}</div>
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
