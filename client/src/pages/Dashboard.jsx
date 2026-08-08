import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { farmService, weatherService, carbonService, sustainabilityService, insuranceService, mockData } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

// Mini Sparkline SVG Component for KPI cards
const Sparkline = ({ points, color = "stroke-[#00A36C]" }) => (
  <svg className="w-16 h-7 overflow-visible shrink-0" viewBox="0 0 60 20">
    <path
      d={points}
      fill="none"
      strokeWidth="2.5"
      className={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dashboard = () => {
  const { language, t } = useLanguage();
  const isNe = language === 'ne';

  // Helper to convert numbers to Devanagari numerals when in Nepali mode
  const fmtNum = (numStr) => {
    if (!isNe) return String(numStr);
    const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
    return String(numStr).replace(/[0-9]/g, (w) => map[w] || w);
  };

  const [farms, setFarms] = useState(mockData.farms);
  const [weather, setWeather] = useState(mockData.weather);
  const [carbonStats, setCarbonStats] = useState(mockData.carbonCredits);
  const [sustainability, setSustainability] = useState(mockData.sustainability);
  const [insurance, setInsurance] = useState(mockData.insurance);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmRes, weatherRes, carbonRes, sustainRes, insureRes] = await Promise.all([
          farmService.getAll(),
          weatherService.getWeather(),
          carbonService.getStats(),
          sustainabilityService.getScore('f-101'),
          insuranceService.getStatus(),
        ]);
        if (farmRes) setFarms(farmRes);
        if (weatherRes) setWeather(weatherRes);
        if (carbonRes) setCarbonStats(carbonRes);
        if (sustainRes) setSustainability(sustainRes);
        if (insureRes) setInsurance(insureRes);
      } catch (err) {
        console.error('Error fetching dashboard update:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 text-slate-800 pb-12">

      {/* ── 1. MAIN DASHBOARD HEADER & BANNER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden py-1">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-[#013822] tracking-tight flex items-center gap-2">
            {t('Namaste! 🙏', 'नमस्ते! 🙏')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            {t("Here's what's happening on your farm today.", 'आज तपाईंको फार्ममा भइरहेका गतिविधिहरूको विवरण यहाँ छ।')}
          </p>
        </div>

        {/* Nepal Farming Landscape Banner Image */}
        <div className="w-full md:w-[500px] h-28 shrink-0 relative rounded-2xl overflow-hidden border border-emerald-200/50 shadow-sm">
          <img
            src="/nepal-banner.png"
            alt="Nepal farming landscape"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* ── 2. TOP STATISTICS CARDS (ROW OF 4) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Sustainability Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#013822] flex items-center justify-center text-xl font-bold shrink-0 border border-emerald-100">
              🌿
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t('Sustainability Score', 'दिगोपन प्राप्ताङ्क')}
              </div>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1 mt-0.5">
                {fmtNum(sustainability.overall_score || '92.4')}
                <span className="text-xs font-bold text-slate-400">/ {fmtNum(100)}</span>
              </div>
              <div className="text-[11px] font-bold text-[#006B45] flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#006B45]"></span>
                {t('Excellent', 'उत्कृष्ट')}
              </div>
            </div>
          </div>
          <Sparkline points="M 5 15 Q 20 5, 35 12 T 55 4" color="stroke-[#00A36C]" />
        </div>

        {/* Card 2: Carbon Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#013822] flex items-center justify-center text-xl font-bold shrink-0 border border-emerald-100">
              ♻️
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t('Carbon Credits', 'कार्बन क्रेडिट')}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {fmtNum(carbonStats.credits_available || 162)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                ≈ ${fmtNum('1,543.00')} USD
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Active Fields */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#013822] flex items-center justify-center text-xl font-bold shrink-0 border border-emerald-100">
              🪴
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t('Active Fields', 'सक्रिय खेत')}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {fmtNum(farms.length || 4)} <span className="text-xs font-bold text-slate-500">{t('Fields', 'क्षेत्र')}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                {fmtNum('35.9')} {t('ha Total Area', 'हेक्टर कुल क्षेत्रफल')}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Current Weather */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold shrink-0 border border-amber-100">
              ☀️
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t('Current Weather', 'हालको मौसम')}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {fmtNum(weather.temperature || '29.4')}°C <span className="text-xs font-bold text-slate-500">{t(weather.condition || 'Partly Cloudy', 'आंशिक बदली')}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                {t('Kirtipur, Nepal', 'कीर्तिपुर, नेपाल')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. SECOND ROW: SUSTAINABILITY PROGRESS & FARMER LEVEL & REWARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Container: Sustainability Progress */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{t('SUSTAINABILITY PROGRESS', 'दिगोपन प्रगति')}</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {t('Requirement: 85+ Score to qualify', 'योग्यता: ८५+ स्कोर आवश्यक')}
              </span>
            </div>

            {/* 3 Timeline nodes */}
            <div className="grid grid-cols-3 gap-4 pt-4 relative">
              <div className="absolute top-[35px] left-10 right-10 h-0.5 bg-emerald-800 -z-0"></div>

              {[
                { year: '2024', score: 87 },
                { year: '2025', score: 90 },
                { year: '2026', score: 92 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-2 relative z-10">
                  <span className="text-xs font-extrabold text-[#013822]">{fmtNum(item.year)}</span>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-[#013822] flex items-center justify-center p-1 shadow-2xs">
                    <span className="text-base">🌱</span>
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {fmtNum(item.score)} <span className="text-[10px] font-normal text-slate-400">/100</span>
                  </div>
                  <div className="text-xs font-bold text-[#013822] flex items-center gap-1">
                    {t('Qualified', 'योग्य')} <span className="text-xs">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Banners - Single Language Strict */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center gap-3 text-emerald-950 font-medium">
              <span className="text-xl shrink-0">🛡️</span>
              <div className="font-bold">
                {t(
                  "You've maintained above 85 for 3 consecutive years. Great job!",
                  'तपाईंले लगातार ३ वर्ष ८५ भन्दा माथि कायम गर्नुभएको छ। उत्कृष्ट!'
                )}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center gap-3 text-emerald-950 font-medium">
              <span className="text-xl shrink-0">🛡️</span>
              <div>
                <div className="font-extrabold text-[#013822]">{t('85+ Maintained for 3 Years', 'लगातार ३ वर्ष ८५+ स्कोर कायम')}</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">{t('Eligible for incentive recommendation', 'अनुदान सिफारिसको लागि योग्य')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container: Farmer Level & Rewards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                {t('FARMER LEVEL & REWARDS', 'कृषक स्तर र पुरस्कार')}
              </h2>
              <Link to="/rewards" className="text-xs font-bold text-[#013822] hover:underline shrink-0">
                {t('View All Rewards →', 'सबै पुरस्कार हेर्नुहोस् →')}
              </Link>
            </div>

            <div className="flex items-start justify-between gap-3 pt-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500">{t('Current Level', 'वर्तमान स्तर')}</div>
                <div className="text-lg font-black text-[#013822] flex items-center gap-2">
                  {t('Sustainability Leader', 'दिगोपन नेता')}
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-[#013822]">{t('Level 4', 'तह ४')}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#00A36C] rounded-full w-[92%]"></div>
                </div>

                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  {isNe
                    ? `तपाईं क्लाइमेट स्टेवार्ड स्तरबाट ${fmtNum(8)} अंक टाढा हुनुहुन्छ।`
                    : 'You are 8 points away from Climate Steward'}
                </div>
              </div>

              {/* Gold Laurels Emblem Shield Badge */}
              <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-300 shadow-sm flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl">🛡️</span>
                <div className="text-[9px] font-black uppercase text-amber-800 tracking-wider">{t('Score', 'प्राप्ताङ्क')}</div>
                <div className="text-sm font-black text-[#013822]">{fmtNum('92.4')} <span className="text-[9px] font-normal text-slate-500">/{fmtNum(100)}</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. THIRD ROW: KRISHI BEEMA SAARATHI – AI INSURANCE ADVISOR ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('Krishi Beema Saarathi – AI Insurance Advisor', 'कृषि बीमा सारथी – एआई बीमा सल्लाहकार')}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs">‹</button>
            <button className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs">›</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Farm Risk Overview */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">{t('Farm Risk Overview', 'फार्म जोखिम अवलोकन')}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Overall Risk', 'कुल जोखिम')}</span>
                <span className="text-xs font-black text-amber-700">{t('Moderate', 'मध्यम')}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center gap-3">
              <span className="text-2xl text-amber-600 shrink-0">🛡️</span>
              <div>
                <div className="text-xs font-extrabold text-amber-900">{t('Overall Risk: Moderate', 'कुल जोखिम: मध्यम')}</div>
                <div className="text-[10px] text-slate-500">{t('Based on your farm & weather data', 'फार्म र मौसम विवरणमा आधारित')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
              <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-100">
                <span>{t('Weather', 'मौसम')}</span>
                <span className="font-bold text-amber-700">{t('Moderate', 'मध्यम')}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-100">
                <span>{t('Crop', 'बाली')}</span>
                <span className="font-bold text-amber-700">{t('Moderate', 'मध्यम')}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-100">
                <span>{t('Pest/Disease', 'कीरा/रोग')}</span>
                <span className="font-bold text-emerald-700">{t('Low', 'न्यून')}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-100">
                <span>{t('Water', 'पानी')}</span>
                <span className="font-bold text-emerald-700">{t('Low', 'न्यून')}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Recommended Coverage */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">{t('Recommended Coverage', 'सुझावित बीमा')}</h4>

              <div className="space-y-1.5 text-xs font-medium text-slate-700 mt-2">
                <div className="flex items-center gap-1.5">✓ <span>{t('Drought Protection', 'खडेरी संरक्षण')}</span></div>
                <div className="flex items-center gap-1.5">✓ <span>{t('Hail / Flood Coverage', 'असिना / बाढी बीमा')}</span></div>
                <div className="flex items-center gap-1.5">✓ <span>{t('Crop Disease Protection', 'बाली रोग संरक्षण')}</span></div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t('Est. Premium', 'अनुमानित प्रिमियम')}</span>
                <span className="font-black text-slate-900">{isNe ? 'रु २,५०० – ४,२००' : 'NPR 2,500 – 4,200'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t('Est. Coverage', 'अनुमानित कभरेज')}</span>
                <span className="font-black text-emerald-700">{isNe ? 'रु १००,००० – ३००,०००' : 'NPR 100,000 – 300,000'}</span>
              </div>

              <Link to="/insurance" className="w-full block text-center py-2 bg-[#013822] hover:bg-[#012d1b] text-white text-xs font-bold rounded-xl transition">
                {t('View Recommendation →', 'सिफारिस हेर्नुहोस् →')}
              </Link>
            </div>
          </div>

          {/* Card 3: Weather & Crop Protection */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">{t('Weather & Crop Protection', 'मौसम र बाली संरक्षण')}</h4>

              <div className="grid grid-cols-4 gap-2 text-center pt-3">
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <div className="text-lg">🏜️</div>
                  <div className="text-[10px] font-bold text-slate-700 mt-1">{t('Drought', 'खडेरी')}</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <div className="text-lg">🌧️</div>
                  <div className="text-[10px] font-bold text-slate-700 mt-1">{t('Heavy Rain', 'भारी वर्षा')}</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <div className="text-lg">🧊</div>
                  <div className="text-[10px] font-bold text-slate-700 mt-1">{t('Hailstorm', 'असिना')}</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <div className="text-lg">🌿</div>
                  <div className="text-[10px] font-bold text-slate-700 mt-1">{t('Disease', 'रोग')}</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic leading-relaxed pt-2 border-t border-slate-200">
              {t('Insurance can help reduce financial loss.', 'बीमाले वित्तीय क्षति कम गर्न मद्दत गर्छ।')}
            </p>
          </div>

        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          <span className="w-2 h-2 rounded-full bg-[#013822]"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
        </div>
      </div>

      {/* ── 5. FOURTH ROW: QUICK ACTIONS & FARM INSIGHTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>{t('QUICK ACTIONS', 'द्रुत कार्यहरू')}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/farms/register"
              className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:text-[#013822] transition flex flex-col items-center justify-center gap-1 shadow-2xs"
            >
              <span className="text-[#013822] text-lg">➕</span>
              <span>{t('Add New Field', 'नयाँ खेत थप्नुहोस्')}</span>
            </Link>
            <Link
              to="/sustainability"
              className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:text-[#013822] transition flex flex-col items-center justify-center gap-1 shadow-2xs"
            >
              <span className="text-[#013822] text-lg">🧪</span>
              <span>{t('Soil Health Test', 'माटो परीक्षण')}</span>
            </Link>
            <Link
              to="/assistant"
              className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:text-[#013822] transition flex flex-col items-center justify-center gap-1 shadow-2xs"
            >
              <span className="text-[#013822] text-lg">💡</span>
              <span>{t('AI Advisory', 'एआई सल्लाह')}</span>
            </Link>
            <Link
              to="/list-product"
              className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:text-[#013822] transition flex flex-col items-center justify-center gap-1 shadow-2xs"
            >
              <span className="text-[#013822] text-lg">📦</span>
              <span>{t('List Product', 'उत्पादन सूचीबद्ध गर्नुहोस्')}</span>
            </Link>
          </div>
        </div>

        {/* Farm Insights */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>{t('FARM INSIGHTS', 'फार्म अन्तर्दृष्टि')}</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg shrink-0 font-bold">💧</div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold">{t('Water Usage Efficiency', 'पानी प्रयोग दक्षता')}</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{fmtNum(78)} % <span className="text-[10px] text-emerald-700 font-bold">{t('Good', 'राम्रो')}</span></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#013822] flex items-center justify-center text-lg shrink-0 font-bold">🌱</div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold">{t('Input Optimization', 'इनपुट अनुकूलन')}</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{fmtNum(85)} % <span className="text-[10px] text-emerald-700 font-bold">{t('Great', 'उत्कृष्ट')}</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 6. FOOTER ── */}
      <footer className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
        © 2025 Krishi Saarathi. All rights reserved.
      </footer>

    </div>
  );
};

export default Dashboard;
