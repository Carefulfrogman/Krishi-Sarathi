import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

export const BuyerDashboard = () => {
  // Mock Data for Buyer Dashboard
  const [stats, setStats] = useState({
    totalOrders: 14,
    activeOrders: 2,
    totalSpent: 4850,
    avgOrder: 346,
    carbonOffsetKg: 840,
    waterSavedLiters: 22400,
    organicRatio: 78
  });

  const [favoriteFarms] = useState([
    { id: 'f-101', name: 'Green Horizon Eco Farm', location: 'Chitwan, Nepal', score: 92 },
    { id: 'f-102', name: 'Sunrise Agro Fields', location: 'Pokhara, Nepal', score: 88 }
  ]);

  const [recommendedProducts] = useState([
    { id: 'p-01', name: 'Organic Buckwheat', origin: 'Mustang Valley', price: '$4.50/kg', rating: '4.9 ★' },
    { id: 'p-02', name: 'Raw Himalayan Honey', origin: 'Central Terai', price: '$12.00/jar', rating: '4.8 ★' }
  ]);

  const [recentlyViewed] = useState([
    { id: 'p-03', name: 'Organic Basmati Rice', origin: 'Chitwan Valley', price: '$2.80/kg' },
    { id: 'p-04', name: 'Pokhareli Green Tea', origin: 'Pokhara Region', price: '$8.50/box' }
  ]);

  const [marketplaceUpdates] = useState([
    { id: 1, title: 'Carbon Credit price updated', text: 'Average credit trading price rose to $24.50/ton (+2.4%).', time: '1h ago' },
    { id: 2, title: 'New Harvest Listings', text: 'Pokhara cooperative listed 4.2 tonnes of organic ginger.', time: '3h ago' }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-8 md:p-10 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl text-white shadow-xl border border-emerald-950/20 pt-10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-blue-700 to-emerald-600"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              💼 Corporate Buyer Command Center
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
              Himalayan Green Traders
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-xl font-medium">
              Track sustainable sourcing footprints, carbon offsets portfolios, and logistics batches from Nepalese cooperatives.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Sourcing Volume */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shrink-0">
            📦
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Orders Summary</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.totalOrders} total</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{stats.activeOrders} in transit logistics</div>
          </div>
        </div>

        {/* KPI 2: Total Spent */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold shrink-0">
            💵
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sourcing Spending</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">${stats.totalSpent} USD</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">${stats.avgOrder} average order</div>
          </div>
        </div>

        {/* KPI 3: Carbon Offset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-bold shrink-0">
            🌱
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carbon Sequestered</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.carbonOffsetKg} kg CO2</div>
            <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Verified IPCC standard</div>
          </div>
        </div>

        {/* KPI 4: Water footprints */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-xl font-bold shrink-0">
            💧
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Water Saved</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.waterSavedLiters} L</div>
            <div className="text-[11px] text-cyan-700 font-semibold mt-0.5">{stats.organicRatio}% Organic crops ratio</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Quick Buyer Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            to="/marketplace"
            className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 text-center font-bold text-xs text-slate-700 hover:text-emerald-800 transition"
          >
            🏪 Browse Marketplace
          </Link>
          <Link
            to="/supplychain"
            className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 text-center font-bold text-xs text-slate-700 hover:text-emerald-800 transition"
          >
            🚚 Track Logistics
          </Link>
          <Link
            to="/marketplace"
            className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 text-center font-bold text-xs text-slate-700 hover:text-emerald-800 transition"
          >
            🔖 Saved Products
          </Link>
          <Link
            to="/dashboard"
            className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 text-center font-bold text-xs text-slate-700 hover:text-emerald-800 transition"
          >
            🌾 Favorite Farms
          </Link>
          <Link
            to="/qr"
            className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 text-center font-bold text-xs text-slate-700 hover:text-emerald-800 transition"
          >
            🔍 Produce QR Verify
          </Link>
        </div>
      </div>

      {/* SVG Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Chart 1: Monthly Sourcing volume (Bar Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Monthly Purchase Volume</h3>
          <div className="h-44 flex items-end justify-between px-4 pb-2 border-b border-slate-100">
            {/* Bar 1 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">12t</span>
              <div className="w-8 bg-emerald-500 rounded-t-md transition-all duration-1000" style={{ height: '70px' }} />
              <span className="text-[10px] text-slate-400 font-bold">May</span>
            </div>
            {/* Bar 2 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">18t</span>
              <div className="w-8 bg-emerald-500 rounded-t-md transition-all duration-1000" style={{ height: '110px' }} />
              <span className="text-[10px] text-slate-400 font-bold">Jun</span>
            </div>
            {/* Bar 3 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">22t</span>
              <div className="w-8 bg-emerald-600 rounded-t-md transition-all duration-1000" style={{ height: '130px' }} />
              <span className="text-[10px] text-slate-400 font-bold">Jul</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Spending Trends (Line Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Spending Trends (USD)</h3>
          <div className="h-44 relative border-b border-slate-100 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
              <path
                d="M 10 40 L 40 25 L 70 30 L 90 10"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              <circle cx="10" cy="40" r="2.5" fill="#047857" />
              <circle cx="40" cy="25" r="2.5" fill="#047857" />
              <circle cx="70" cy="30" r="2.5" fill="#047857" />
              <circle cx="90" cy="10" r="2.5" fill="#047857" />
            </svg>
            <div className="absolute bottom-2 left-0 right-0 flex justify-between text-[10px] text-slate-400 font-bold px-2">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Sustainable Purchases (Donut Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Sustainable Sourcing Share</h3>
          <div className="flex items-center justify-around gap-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* 22% Conventional / Transition */}
                <circle cx="50" cy="50" r="35" stroke="#E2E8F0" strokeWidth="12" fill="transparent" />
                {/* 78% Organic */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="#10B981"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="219.9"
                  strokeDashoffset="48.3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-black text-slate-800">78%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Organic</span>
              </div>
            </div>
            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Certified Organic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200"></span>
                <span>In Transition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) - Recommended, Recent Products & Farms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Favorite Farms */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Saved Cooperatives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteFarms.map((farm) => (
                <div key={farm.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">{farm.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium block">{farm.location}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                      {farm.score} Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing recommendations & recently viewed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Recommended Products */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recommended Crop Batches</h3>
              <div className="space-y-3">
                {recommendedProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
                    <div>
                      <span>{p.name}</span>
                      <span className="block text-[9px] text-slate-400 font-medium">{p.origin} • {p.rating}</span>
                    </div>
                    <span className="text-emerald-700">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recently Viewed</h3>
              <div className="space-y-3">
                {recentlyViewed.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
                    <div>
                      <span>{p.name}</span>
                      <span className="block text-[9px] text-slate-400 font-medium">{p.origin}</span>
                    </div>
                    <span className="text-slate-500">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (1/3 width) - Marketplace alerts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Marketplace & ESG Updates</h3>
          <div className="space-y-4">
            {marketplaceUpdates.map((up) => (
              <div key={up.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-extrabold text-xs text-slate-800">{up.title}</h4>
                  <span className="text-[9px] text-slate-400 font-medium shrink-0">{up.time}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{up.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default BuyerDashboard;
