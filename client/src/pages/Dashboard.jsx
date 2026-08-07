import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { farmService, weatherService, carbonService, sustainabilityService, insuranceService, mockData } from '../services/api';

// English/Nepali Dictionary
const localizations = {
  en: {
    welcome: 'Namaskar! नमस्कार • Command Center',
    subtitle: "Serving sustainable agriculture across Nepal's valleys.",
    averageESG: 'Average ESG Score',
    totalArea: 'Total Area',
    plotsCount: '3 Active Plots',
    healthRating: 'Health Rating',
    esgGrade: 'Excellent ESG Grade',
    carbonCredits: 'Carbon Credits',
    carbonEst: 'Est. $3,430 USD',
    protectedLand: 'Protected Land',
    parametricCovered: 'Parametric Covered',
    quickActions: 'Quick Actions',
    addNewField: 'Add New Field',
    scanProduceQR: 'Scan Produce QR',
    calculateScore: 'Calculate Sustainability',
    askAssistant: 'Ask AI Assistant',
    fieldsMonitoring: 'Fields Under Monitoring',
    addAnotherField: '+ Add Another Field',
    organicLabel: '100% Organic',
    viewDetails: 'View Details',
    weatherForecast: 'Weather Forecast',
    conditionLabel: 'Condition',
    humidityLabel: 'Humidity',
    rainfallLabel: 'Rainfall',
    windSpeedLabel: 'Wind Speed',
    soilMoistureLabel: 'Soil Moisture',
    uvIndexLabel: 'UV Index',
    disasterAlerts: 'Disaster Alerts',
    severityHigh: 'High Severity',
    severityMedium: 'Medium Severity',
    resolved: 'Resolved',
    monitoring: 'Under Monitoring',
    aiRecommendations: 'AI Recommendations',
    insuranceStatus: 'Insurance Status',
    policyId: 'Policy ID',
    coverage: 'Coverage Amount',
    premium: 'Premium',
    riskRating: 'Risk Rating',
    claims: 'Active Claims',
    approved: 'Approved (AI Auto-verified)',
    recentReports: 'Recent Reports',
    recentActivities: 'Recent Activities',
    viewReport: 'View PDF',
    activityTitle: {
      planted: 'Seeds Planted',
      fertilizer: 'Bio-Fertilizer Applied',
      harvested: 'Harvested',
      quality: 'Quality Assessed'
    }
  },
  ne: {
    welcome: 'नमस्कार • कमान्ड सेन्टर',
    subtitle: 'नेपालका पहाड र तराई क्षेत्रहरूमा दिगो कृषिको प्रवर्द्धन।',
    averageESG: 'औसत ईएसजी स्कोर',
    totalArea: 'कुल क्षेत्रफल',
    plotsCount: '३ सक्रिय प्लटहरू',
    healthRating: 'स्वास्थ्य स्थिति',
    esgGrade: 'उत्कृष्ट ईएसजी ग्रेड',
    carbonCredits: 'कार्बन क्रेडिट',
    carbonEst: 'अनुमानित $३,४३० USD',
    protectedLand: 'संरक्षित जग्गा',
    parametricCovered: 'प्यारामेट्रिक बिमा',
    quickActions: 'द्रुत कार्यहरू',
    addNewField: 'नयाँ क्षेत्र थप्नुहोस्',
    scanProduceQR: 'उत्पादन क्यूआर स्क्यान',
    calculateScore: 'दिगोपन गणना गर्नुहोस्',
    askAssistant: 'एआई सहायक सोध्नुहोस्',
    fieldsMonitoring: 'निगरानीमा रहेका क्षेत्रहरू',
    addAnotherField: '+ थप क्षेत्र थप्नुहोस्',
    organicLabel: '१००% प्राङ्गारिक',
    viewDetails: 'विवरण हेर्नुहोस्',
    weatherForecast: 'मौसम पूर्वानुमान',
    conditionLabel: 'अवस्था',
    humidityLabel: 'आर्द्रता',
    rainfallLabel: 'वर्षा',
    windSpeedLabel: 'हावाको गति',
    soilMoistureLabel: 'माटोको आर्द्रता',
    uvIndexLabel: 'युभी सूचकांक',
    disasterAlerts: 'विपद् सूचना र अलर्टहरू',
    severityHigh: 'उच्च जोखिम',
    severityMedium: 'मध्यम जोखिम',
    resolved: 'समाधान भएको',
    monitoring: 'निगरानीमा',
    aiRecommendations: 'एआई सुझाव र सल्लाह',
    insuranceStatus: 'बीमा स्थिति',
    policyId: 'बीमा नीति आईडी',
    coverage: 'बीमा रकम',
    premium: 'प्रिमियम',
    riskRating: 'जोखिम मूल्याङ्कन',
    claims: 'सक्रिय दाबीहरू',
    approved: 'स्वीकृत (एआई प्रमाणित)',
    recentReports: 'हालका प्रतिवेदनहरू',
    recentActivities: 'हालका गतिविधिहरू',
    viewReport: 'प्रतिवेदन पिडिएफ',
    activityTitle: {
      planted: 'बीउ रोपियो',
      fertilizer: 'जैविक मल प्रयोग गरियो',
      harvested: 'बाली काटियो',
      quality: 'गुणस्तर परीक्षण भयो'
    }
  }
};

// SVG Mini Sparkline components for KPI cards
const Sparkline = ({ points, color = "stroke-secondary-green" }) => (
  <svg className="w-16 h-8 overflow-visible shrink-0" viewBox="0 0 60 20">
    <path
      d={points}
      fill="none"
      strokeWidth="2"
      className={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dashboard = () => {
  const [lang, setLang] = useState('en');
  const t = localizations[lang];

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
    <div className="max-w-7xl mx-auto px-2 py-4 space-y-8 bg-bg-cream min-h-screen text-charcoal">
      
      {/* Top Banner & Language Selector */}
      <div className="relative overflow-hidden p-8 md:p-10 bg-primary-green rounded-3xl text-white shadow-xl pt-10 border border-secondary-green/20">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 200 L 120 80 L 200 130 L 300 30 L 400 120 L 400 200 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-bg-cream border border-white/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              🇳🇵 {t.welcome}
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
              Green Horizon Eco Farm
            </h1>
            <p className="text-sm text-bg-cream max-w-xl font-medium leading-relaxed">
              {t.subtitle} {t.averageESG}: <strong className="text-white font-extrabold">{sustainability.overall_score || '89.4'} / 100</strong>.
            </p>
          </div>

          {/* Lang Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                lang === 'en' ? 'bg-white text-primary-green shadow-sm' : 'text-bg-cream hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('ne')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                lang === 'ne' ? 'bg-white text-primary-green shadow-sm' : 'text-bg-cream hover:text-white'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Sustainability score */}
        <div className="bg-white p-6 rounded-2xl border border-soil-brown/10 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-green/20 text-primary-green flex items-center justify-center text-xl font-bold shrink-0">
              🌿
            </div>
            <div>
              <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">{t.healthRating}</div>
              <div className="text-xl font-black text-charcoal mt-0.5">{sustainability.overall_score || '89.4'}%</div>
              <div className="text-[11px] text-primary-green font-semibold mt-0.5">{t.esgGrade}</div>
            </div>
          </div>
          <Sparkline points="M 5 15 Q 15 5, 25 10 T 55 5" color="stroke-secondary-green" />
        </div>

        {/* Card 2: Carbon Credits */}
        <div className="bg-white p-6 rounded-2xl border border-soil-brown/10 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-golden-harvest/20 text-sunrise flex items-center justify-center text-xl font-bold shrink-0">
              🪙
            </div>
            <div>
              <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">{t.carbonCredits}</div>
              <div className="text-xl font-black text-charcoal mt-0.5">{carbonStats.credits_available || 140} Units</div>
              <div className="text-[11px] text-golden-harvest font-semibold mt-0.5">{t.carbonEst}</div>
            </div>
          </div>
          <Sparkline points="M 5 15 Q 18 12, 30 8 T 55 2" color="stroke-golden-harvest" />
        </div>

        {/* Card 3: Protected Area */}
        <div className="bg-white p-6 rounded-2xl border border-soil-brown/10 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-mountain-gray/20 text-mountain-gray flex items-center justify-center text-xl font-bold shrink-0">
              📍
            </div>
            <div>
              <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">{t.totalArea}</div>
              <div className="text-xl font-black text-charcoal mt-0.5">35.9 Ha</div>
              <div className="text-[11px] text-soil-brown font-semibold mt-0.5">{t.plotsCount}</div>
            </div>
          </div>
          <Sparkline points="M 5 10 Q 20 10, 35 10 T 55 10" color="stroke-mountain-gray" />
        </div>

        {/* Card 4: Weather summary */}
        <div className="bg-white p-6 rounded-2xl border border-soil-brown/10 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sunrise/20 text-sunrise flex items-center justify-center text-xl font-bold shrink-0">
              ☀️
            </div>
            <div>
              <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">Chitwan Temp</div>
              <div className="text-xl font-black text-charcoal mt-0.5">{weather.temperature || '28.4'}°C</div>
              <div className="text-[11px] text-sunrise font-semibold mt-0.5">{weather.condition || 'Partly Cloudy'}</div>
            </div>
          </div>
          <Sparkline points="M 5 12 Q 15 15, 30 8 T 55 4" color="stroke-sunrise" />
        </div>
      </div>

      {/* Quick Actions (द्रुत कार्यहरू) */}
      <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
          <span>⚡</span> {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/farms/register"
            className="p-4 bg-bg-cream hover:bg-accent-green/20 rounded-2xl border border-soil-brown/10 text-center font-bold text-xs text-charcoal hover:text-primary-green transition"
          >
            ➕ {t.addNewField}
          </Link>
          <Link
            to="/qr"
            className="p-4 bg-bg-cream hover:bg-accent-green/20 rounded-2xl border border-soil-brown/10 text-center font-bold text-xs text-charcoal hover:text-primary-green transition"
          >
            📱 {t.scanProduceQR}
          </Link>
          <Link
            to="/sustainability"
            className="p-4 bg-bg-cream hover:bg-accent-green/20 rounded-2xl border border-soil-brown/10 text-center font-bold text-xs text-charcoal hover:text-primary-green transition"
          >
            🌿 {t.calculateScore}
          </Link>
          <Link
            to="/assistant"
            className="p-4 bg-bg-cream hover:bg-accent-green/20 rounded-2xl border border-soil-brown/10 text-center font-bold text-xs text-charcoal hover:text-primary-green transition"
          >
            🤖 {t.askAssistant}
          </Link>
        </div>
      </div>

      {/* Three Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Fields list & Weather Forecast */}
        <div className="space-y-8">
          
          {/* Registered Fields */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-soil-brown/5">
              <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider">
                🌾 {t.fieldsMonitoring}
              </h2>
            </div>

            <div className="space-y-3">
              {farms.map((farm) => (
                <div key={farm.id} className="p-3 bg-bg-cream rounded-xl border border-soil-brown/10 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-charcoal">{farm.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary-green/20 text-primary-green font-bold uppercase shrink-0">
                      {farm.sustainability_score} / 100
                    </span>
                  </div>
                  <div className="text-[10px] text-mountain-gray font-medium flex items-center justify-between">
                    <span>{farm.location}</span>
                    <span>{farm.area_hectares} Ha</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/farms/${farm.id}`}
                      className="text-[10px] font-extrabold text-secondary-green hover:underline"
                    >
                      {t.viewDetails} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Details (मौसम) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>🌦️</span> {t.weatherForecast}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 bg-bg-cream p-4 rounded-2xl border border-soil-brown/10 text-xs">
              <div>
                <span className="text-mountain-gray block font-bold">{t.conditionLabel}</span>
                <span className="font-extrabold text-charcoal">{weather.condition}</span>
              </div>
              <div>
                <span className="text-mountain-gray block font-bold">{t.humidityLabel}</span>
                <span className="font-extrabold text-charcoal">{weather.humidity}%</span>
              </div>
              <div>
                <span className="text-mountain-gray block font-bold">{t.rainfallLabel}</span>
                <span className="font-extrabold text-charcoal">{weather.rainfall_mm} mm</span>
              </div>
              <div>
                <span className="text-mountain-gray block font-bold">{t.windSpeedLabel}</span>
                <span className="font-extrabold text-charcoal">{weather.wind_speed} km/h</span>
              </div>
            </div>

            {/* Weather 5-day list */}
            <div className="space-y-2 pt-2">
              {weather.forecast?.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-soil-brown font-bold border-b border-soil-brown/10 pb-1.5 last:border-0 last:pb-0">
                  <span>{day.day}</span>
                  <span className="text-mountain-gray font-medium">Rain Prob: {day.rainProb}</span>
                  <span>{day.temp}°C</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 2: Disaster Alerts & AI recommendations */}
        <div className="space-y-8">
          
          {/* Disaster Alerts (विपद् सूचना) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>🚨</span> {t.disasterAlerts}
            </h2>
            <div className="space-y-3">
              {mockData.disasters.map((dis) => (
                <div
                  key={dis.id}
                  className={`p-4 rounded-xl border flex flex-col gap-1 ${
                    dis.severity === 'High'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-golden-harvest/10 border-golden-harvest/30 text-soil-brown'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs">{dis.type}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                        dis.severity === 'High' ? 'bg-rose-200 text-rose-900' : 'bg-golden-harvest/20 text-sunrise'
                      }`}
                    >
                      {dis.severity === 'High' ? t.severityHigh : t.severityMedium}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{dis.location}</p>
                  <div className="flex justify-between items-center text-[9px] pt-1 border-t border-dashed border-soil-brown/20 mt-1 opacity-80">
                    <span>{dis.date}</span>
                    <span className="font-bold">{dis.status === 'Resolved' ? t.resolved : t.monitoring}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations (AI सुझाव) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>💡</span> {t.aiRecommendations}
            </h2>
            
            <div className="p-4 bg-accent-green/10 border border-accent-green/20 rounded-xl space-y-2">
              <span className="text-primary-green font-bold text-xs block">🌾 Localized Rice Advice</span>
              <p className="text-xs text-charcoal leading-relaxed font-medium">
                {weather.ai_advice || 'Postpone fertilizer application due to monsoonal rainfall expected tomorrow.'}
              </p>
            </div>

            <div className="p-4 bg-mountain-gray/10 border border-mountain-gray/20 rounded-xl space-y-2">
              <span className="text-mountain-gray font-bold text-xs block">🌿 Carbon Optimization</span>
              <p className="text-xs text-charcoal leading-relaxed font-medium">
                Transition to zero-tillage seeders on Field 102 to increase your carbon storage capability and unlock higher carbon trade premium values.
              </p>
            </div>
          </div>

        </div>

        {/* Column 3: Insurance, Reports & Activities */}
        <div className="space-y-8">
          
          {/* Insurance Status (बीमा) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>🛡️</span> {t.insuranceStatus}
            </h2>
            <div className="p-4 bg-bg-cream border border-soil-brown/10 rounded-xl space-y-2.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-mountain-gray font-bold">{t.policyId}</span>
                <span className="font-extrabold">{insurance.policy_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mountain-gray font-bold">{t.coverage}</span>
                <span className="font-extrabold">${insurance.coverage_amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mountain-gray font-bold">{t.premium}</span>
                <span className="font-extrabold">${insurance.premium_usd} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mountain-gray font-bold">{t.riskRating}</span>
                <span className="font-bold text-primary-green">{insurance.risk_rating}</span>
              </div>
            </div>

            {/* Claims history */}
            <div className="space-y-2 pt-2 border-t border-soil-brown/10">
              <span className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider block">{t.claims}</span>
              {insurance.active_claims?.map((cl, idx) => (
                <div key={idx} className="p-2.5 bg-bg-cream border border-soil-brown/10 rounded-lg text-xs font-bold text-charcoal">
                  <div className="flex justify-between">
                    <span>{cl.hazard}</span>
                    <span className="text-secondary-green">${cl.claimed_amount}</span>
                  </div>
                  <div className="text-[10px] text-mountain-gray font-medium mt-1 flex justify-between">
                    <span>{cl.date}</span>
                    <span>{t.approved}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports (हालका प्रतिवेदन) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>📄</span> {t.recentReports}
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Soil Lab report (Chitwan)', date: '2026-07-28' },
                { name: 'NDVI Canopy Scan (Field 101)', date: '2026-07-15' },
                { name: 'Gold Standard Carbon Verification', date: '2026-06-30' }
              ].map((rep, idx) => (
                <div key={idx} className="p-3 bg-bg-cream rounded-xl border border-soil-brown/10 flex items-center justify-between gap-4 text-xs font-bold text-charcoal">
                  <div className="space-y-0.5">
                    <span>{rep.name}</span>
                    <span className="block text-[10px] text-mountain-gray font-medium">{rep.date}</span>
                  </div>
                  <button className="px-2.5 py-1.5 bg-white border border-soil-brown/20 hover:border-secondary-green rounded-lg text-[10px] transition text-soil-brown">
                    {t.viewReport}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities (हालका गतिविधि) */}
          <div className="bg-white p-6 rounded-3xl border border-soil-brown/10 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>⏳</span> {t.recentActivities}
            </h2>
            <div className="relative border-l-2 border-soil-brown/10 pl-4 space-y-4">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-secondary-green border border-white"></span>
                <span className="text-xs font-bold block text-charcoal">{t.activityTitle.fertilizer}</span>
                <span className="text-[10px] text-mountain-gray font-medium">2025-08-01 • Vermicompost & Solar Biochar</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-mountain-gray border border-white"></span>
                <span className="text-xs font-bold block text-charcoal">{t.activityTitle.planted}</span>
                <span className="text-[10px] text-mountain-gray font-medium">2025-06-15 • Certified Organic Basmati Seed</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-mountain-gray border border-white"></span>
                <span className="text-xs font-bold block text-charcoal">{t.activityTitle.quality}</span>
                <span className="text-[10px] text-mountain-gray font-medium">2025-05-12 • Soil testing complete</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
