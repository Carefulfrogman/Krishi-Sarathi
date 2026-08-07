import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CircularProgress = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
        <circle
          cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-emerald-700">
        <span className="text-2xl font-black leading-none">{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};

export const QRTrace = () => {
  const mapRef = useRef(null);

  const productData = {
    qrId: 'QR-NEP-2026-8841',
    name: 'Organic Pokhareli Jethoboodho Basmati Rice',
    nameNe: 'जेठोबुढो बासमती चामल',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    harvestDate: '2026-08-04',
    packagingDate: '2026-08-06',
    expiryDate: '2027-08-04',
    scanCount: 14,
    farmer: {
      name: 'Ram Bahadur Thapa',
      farmName: 'Green Horizon Eco Farm',
      location: 'Bharatpur-10, Chitwan, Bagmati Province',
      coords: [27.6833, 84.4333]
    },
    sustainability: {
      score: 96,
      carbonFootprint: '-1.42 kg CO2e / kg (Net Sequestered)',
      waterUsage: '320 Litres / kg (Solar Drip Optimized)',
    },
    certifications: [
      { name: 'Organic Certified', icon: '🌿' },
      { name: 'QR Provenance Verified', icon: '🛡️' },
      { name: 'Satellite AI Verified', icon: '🛰️' }
    ],
    otherCrops: [
      { name: 'Mustard (तोरी)', emoji: '🌼' },
      { name: 'Lentils (मुसुरो)', emoji: '🌱' },
      { name: 'Maize (मकै)', emoji: '🌽' },
      { name: 'Potatoes (आलु)', emoji: '🥔' },
      { name: 'Cauliflower (काउली)', emoji: '🥦' }
    ],
    aiPricing: {
      basePrice: 'Rs. 180 / kg',
      organicPremium: '+ Rs. 45',
      fairTradeBonus: '+ Rs. 15',
      finalPrice: 'Rs. 240 / kg',
      reasoning: 'AI pricing engine applied a 25% premium due to verified zero-chemical nitrogen application and high carbon sequestration score. Fair-trade bonus directly deposited to farmer\'s cooperative wallet.'
    },
    timeline: [
      { step: 'Harvested', date: 'Aug 04, 2026 - 06:30 AM', location: 'Chitwan Farm', status: 'completed' },
      { step: 'Quality Checked', date: 'Aug 05, 2026 - 11:15 AM', location: 'NARC Regional Lab', status: 'completed' },
      { step: 'Packed & Sealed', date: 'Aug 06, 2026 - 09:00 AM', location: 'Chitwan Packaging Facility', status: 'completed' },
      { step: 'Transported', date: 'Aug 06, 2026 - 14:00 PM', location: 'Highway Transit', status: 'completed' },
      { step: 'Marketplace Hub', date: 'Aug 07, 2026 - 08:30 AM', location: 'Kalimati Hub, Kathmandu', status: 'completed' },
      { step: 'Delivered to You', date: 'Pending', location: 'Destination', status: 'pending' },
    ],
    deliveryConditions: [
      { metric: 'Avg Temperature', value: '18°C', status: 'Optimal' },
      { metric: 'Humidity', value: '45%', status: 'Dry/Safe' },
      { metric: 'Transport Vehicle', value: 'EV Truck #402', status: 'Zero Emission' }
    ]
  };

  useEffect(() => {
    if (!mapRef.current && window.L) {
      const map = window.L.map('dpp-map', { zoomControl: false, attributionControl: false }).setView(productData.farmer.coords, 12);
      
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      const farmIcon = window.L.divIcon({
        className: 'bg-emerald-600 w-5 h-5 rounded-full border-[3px] border-white shadow-xl',
        iconSize: [20, 20]
      });

      window.L.marker(productData.farmer.coords, { icon: farmIcon })
        .addTo(map)
        .bindPopup(`<b class="font-bold text-slate-800">${productData.farmer.farmName}</b><br/><span class="text-xs text-slate-500">${productData.farmer.location}</span>`)
        .openPopup();
      
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* 1. TOP HEADER & BADGE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Decorative background flair */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>

        {/* Large QR Code Area */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-emerald-100 shadow-sm relative group">
             {/* Simulated QR Pattern */}
             <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
               <rect x="0" y="0" width="100" height="100" fill="#ffffff"/>
               <path d="M5,5 h30 v30 h-30 z M65,5 h30 v30 h-30 z M5,65 h30 v30 h-30 z" fill="#0F172A" />
               <path d="M10,10 h20 v20 h-20 z M70,10 h20 v20 h-20 z M10,70 h20 v20 h-20 z" fill="white" />
               <path d="M15,15 h10 v10 h-10 z M75,15 h10 v10 h-10 z M15,75 h10 v10 h-10 z" fill="#0F172A" />
               <path d="M40,5 h20 v10 h-20 z M45,20 h10 v20 h-10 z M5,40 h20 v10 h-20 z M30,45 h20 v10 h-20 z M60,40 h35 v10 h-35 z M45,60 h10 v35 h-10 z M65,65 h10 v10 h-10 z M80,65 h15 v10 h-15 z M65,80 h30 v15 h-30 z" fill="#0F172A" />
               <rect x="42" y="42" width="16" height="16" rx="4" fill="#10B981" />
             </svg>
             
             {/* Verification Shield Badge superimposed */}
             <div className="absolute -bottom-3 -right-3 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md" title="Verified by Krishi Saarathi">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            QR Provenance Verified
          </span>
        </div>

        {/* Product & Farm Details */}
        <div className="flex-1 space-y-4 text-center md:text-left z-10">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{productData.name}</h1>
            <p className="text-sm font-bold text-slate-500">{productData.nameNe} • <span className="font-medium">ID: {productData.qrId}</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 pt-2">
            <img src={productData.image} alt={productData.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Farm</p>
              <h3 className="text-base font-extrabold text-emerald-800">{productData.farmer.farmName}</h3>
              <p className="text-xs font-medium text-slate-600">Farmer: <span className="font-bold">{productData.farmer.name}</span></p>
              <p className="text-xs text-slate-500">{productData.farmer.location}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. METRICS & DATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sustainability Score */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-6">
          <CircularProgress score={productData.sustainability.score} />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">Sustainability Score</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Calculated via AI satellite scanning and zero-chemical farm inputs.</p>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Environmental Impact</h4>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Carbon Footprint</span>
              <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{productData.sustainability.carbonFootprint}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Water Usage</span>
              <span className="text-sm font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{productData.sustainability.waterUsage}</span>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
           <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Traceability Dates</h4>
           <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
               <span className="block text-[9px] font-bold text-slate-400 uppercase">Harvested</span>
               <span className="text-xs font-black text-slate-800">{productData.harvestDate}</span>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
               <span className="block text-[9px] font-bold text-slate-400 uppercase">Packaged</span>
               <span className="text-xs font-black text-slate-800">{productData.packagingDate}</span>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2">
               <span className="block text-[9px] font-bold text-slate-400 uppercase">Best Before</span>
               <span className="text-xs font-black text-slate-800">{productData.expiryDate}</span>
             </div>
           </div>
        </div>

      </div>

      {/* CERTIFICATIONS STRIP */}
      <div className="bg-emerald-900 rounded-2xl p-4 flex flex-wrap justify-center gap-4 sm:gap-8 shadow-inner border border-emerald-800">
        {productData.certifications.map((cert, i) => (
          <div key={i} className="flex items-center gap-2 text-emerald-50">
            <span className="text-xl">{cert.icon}</span>
            <span className="text-xs font-bold tracking-wide">{cert.name}</span>
          </div>
        ))}
      </div>

      {/* 3. TWO COLUMN MAIN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Map, Farm Profile, Pricing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-sm overflow-hidden">
            <div id="dpp-map" className="w-full h-48 rounded-2xl bg-slate-100 relative z-0"></div>
            <div className="p-4 text-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Geographic Origin</span>
              <p className="text-xs font-bold text-slate-800">{productData.farmer.location}</p>
            </div>
          </div>

          {/* Other Crops Grown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
             <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Also grown on this farm</h4>
             <div className="flex flex-wrap gap-2">
               {productData.otherCrops.map((crop, i) => (
                 <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                   <span>{crop.emoji}</span> {crop.name}
                 </span>
               ))}
             </div>
          </div>

          {/* AI Pricing Explanation */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl pointer-events-none">✨</div>
             <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Krishi Saarathi AI Pricing</h4>
             <div className="space-y-2">
               <div className="flex justify-between text-xs text-slate-600 font-medium">
                 <span>Base Market Price</span><span>{productData.aiPricing.basePrice}</span>
               </div>
               <div className="flex justify-between text-xs text-emerald-600 font-bold">
                 <span>Organic & Sustainability Premium</span><span>{productData.aiPricing.organicPremium}</span>
               </div>
               <div className="flex justify-between text-xs text-sky-600 font-bold">
                 <span>Direct Farmer Fair-Trade Bonus</span><span>{productData.aiPricing.fairTradeBonus}</span>
               </div>
               <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
                 <span className="text-xs font-black text-slate-900">Final Transparent Price</span>
                 <span className="text-lg font-black text-slate-900">{productData.aiPricing.finalPrice}</span>
               </div>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic bg-white/50 p-3 rounded-xl border border-slate-100">
               {productData.aiPricing.reasoning}
             </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Timeline & Logistics */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Farm-to-Buyer Provenance Timeline</h3>
            
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {productData.timeline.map((item, index) => {
                const isCompleted = item.status === 'completed';
                return (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                    
                    {/* Icon Node */}
                    <div className={`flex items-center justify-center w-11 h-11 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      ) : (
                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition shadow-xs">
                      <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.date}</span>
                        <h4 className={`text-sm font-black ${isCompleted ? 'text-emerald-800' : 'text-slate-500'}`}>{item.step}</h4>
                        <span className="text-xs text-slate-600 font-medium">{item.location}</span>
                      </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Verified Logistics & Storage Conditions</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              During transport and storage, environmental conditions are continuously monitored via IoT sensors to ensure product integrity and freshness.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {productData.deliveryConditions.map((cond, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{cond.metric}</span>
                  <span className="text-lg font-black text-slate-800 block">{cond.value}</span>
                  <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">{cond.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER - SCAN HISTORY */}
      <div className="text-center pt-8 space-y-3">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Passport Scan History</p>
         <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm">
           <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
           </span>
           <span className="text-sm font-black text-slate-800">Verified {productData.scanCount} times by consumers.</span>
         </div>
      </div>

    </div>
  );
};

export default QRTrace;
