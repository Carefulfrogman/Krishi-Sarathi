import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

export const Home = () => {
  const [lang, setLang] = useState('en');

  // Simple localization toggle for demonstration
  const t = {
    en: {
      badge: "🇳🇵 Nepal's AI Platform for Sustainable Agriculture",
      heading: "Empower Your Farm with AI",
      desc: "Optimize yields with satellite AI. Trace produce via QR passports, and unlock new revenue streams through global carbon markets.",
      trust1: "🌱 SDG Focused",
      trust2: "🛰 Satellite Verified",
      trust3: "🤖 AI Powered",
      trust4: "🇳🇵 Built for Nepal",
      btn1: "Start Your Journey",
      btn2: "See How It Works",
      btn3: "Visit the Bazaar"
    },
    ne: {
      badge: "🇳🇵 दिगो कृषिको लागि नेपालको एआई प्लेटफर्म",
      heading: "एआई मार्फत किसानलाई सशक्तिकरण",
      desc: "आधुनिक एआई प्रविधिको साथ खेती सुधार गर्नुहोस् र कार्बन क्रेडिट मार्फत नयाँ आम्दानी खोल्नुहोस्।",
      trust1: "🌱 SDG लक्षित",
      trust2: "🛰 स्याटेलाइट प्रमाणित",
      trust3: "🤖 एआई प्रविधि",
      trust4: "🇳🇵 नेपालको लागि निर्मित",
      btn1: "यात्रा सुरु गर्नुहोस्",
      btn2: "कसरी काम गर्छ हेर्नुहोस्",
      btn3: "बजार भ्रमण गर्नुहोस्"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-bg-cream text-charcoal font-sans relative overflow-hidden">
      
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/hero.jpg')] bg-cover bg-center opacity-[0.03] mix-blend-multiply"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-green/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-accent-green/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 w-full h-[10px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZD0iTTAgMGgxMHYxMEgwem01IDVINTBWMUg1eiIgZmlsbD0iIzhENkU2MyIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo2.png" alt="Krishi Saarathi Logo" className="w-16 h-16 object-contain drop-shadow-sm" />
            <span className="font-extrabold text-2xl text-primary-green tracking-tight hidden sm:block">
              Krishi <span className="text-charcoal">Saarathi</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Our Story</Link>
            <Link to="/dashboard" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Solutions</Link>
            <Link to="/farm-marketplace" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Marketplace</Link>
            <Link to="/qr" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Resources</Link>
            <a href="mailto:contact@krishisaarathi.com" className="text-sm font-semibold text-mountain-gray hover:text-primary-green transition-colors">Contact</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-bg-cream/50 p-1 rounded-full border border-mountain-gray/10">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-primary-green' : 'text-mountain-gray hover:text-charcoal'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('ne')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ne' ? 'bg-white shadow-sm text-primary-green' : 'text-mountain-gray hover:text-charcoal'}`}
              >
                नेपाली
              </button>
            </div>
            
            {/* CTA */}
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-golden-harvest hover:bg-sunrise text-white text-sm font-extrabold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Join Us
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-48 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center z-10">
        
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-5 space-y-8 relative z-20">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-mountain-gray/10 rounded-full shadow-sm">
            <span className="text-xs font-bold text-primary-green tracking-wide">
              {t.badge}
            </span>
          </div>

          <h1 className="text-5xl lg:text-[4.25rem] font-black text-charcoal leading-[1.05] tracking-tight drop-shadow-sm">
            {t.heading.split('AI').map((part, i, arr) => 
              <React.Fragment key={i}>
                {part}{i !== arr.length - 1 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-accent-green">AI</span>}
              </React.Fragment>
            )}
          </h1>

          <p className="text-lg text-mountain-gray leading-relaxed max-w-lg font-medium">
            {t.desc}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="flex items-center gap-2 text-sm font-bold text-soil-brown bg-white/50 px-3 py-2 rounded-xl">
              {t.trust1}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-soil-brown bg-white/50 px-3 py-2 rounded-xl">
              {t.trust2}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-soil-brown bg-white/50 px-3 py-2 rounded-xl">
              {t.trust3}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-soil-brown bg-white/50 px-3 py-2 rounded-xl">
              {t.trust4}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-primary-green hover:bg-secondary-green text-white font-extrabold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              {t.btn1} <Icon name="arrowRight" size={18} />
            </Link>
            <Link 
              to="/farm-marketplace" 
              className="px-8 py-4 bg-gradient-to-r from-golden-harvest to-sunrise text-white font-extrabold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t.btn3}
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Glassmorphism Dashboard Mockup */}
        <div className="lg:col-span-7 relative h-full min-h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
          
          {/* Main Dashboard Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-mountain-gray/10 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 z-10">
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-mountain-gray/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  👨‍🌾
                </div>
                <div>
                  <div className="text-xs font-bold text-mountain-gray uppercase tracking-wider">Namaste</div>
                  <div className="text-lg font-black text-charcoal leading-none">Ram Bahadur</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-secondary-green border border-white shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary-green animate-pulse"></div>
                Satellite Synced
              </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-bg-cream/50 rounded-2xl p-5 shadow-sm border border-mountain-gray/10 hover:-translate-y-1 transition-transform">
                <Icon name="shield" size={18} className="text-primary-green mb-2" />
                <div className="text-[10px] font-bold text-mountain-gray uppercase">ESG Score</div>
                <div className="text-2xl font-black text-charcoal">94<span className="text-sm text-mountain-gray">/100</span></div>
              </div>
              <div className="bg-bg-cream/50 rounded-2xl p-5 shadow-sm border border-mountain-gray/10 hover:-translate-y-1 transition-transform">
                <Icon name="droplet" size={18} className="text-secondary-green mb-2" />
                <div className="text-[10px] font-bold text-mountain-gray uppercase">Water Saved</div>
                <div className="text-2xl font-black text-charcoal">12k<span className="text-sm text-mountain-gray"> L</span></div>
              </div>
              <div className="bg-bg-cream/50 rounded-2xl p-5 shadow-sm border border-mountain-gray/10 hover:-translate-y-1 transition-transform">
                <Icon name="cloud" size={18} className="text-accent-green mb-2" />
                <div className="text-[10px] font-bold text-mountain-gray uppercase">Carbon Credits</div>
                <div className="text-2xl font-black text-primary-green">48<span className="text-sm text-mountain-gray"> tCO₂</span></div>
              </div>
            </div>

            {/* Farm Overview Image with Glass Overlay */}
            <div className="relative rounded-2xl overflow-hidden h-48 mb-8 shadow-sm border border-mountain-gray/10 group">
              <img src="/hero.jpg" alt="Terraced Fields" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-white font-extrabold text-lg">Chitwan Valley Plot</div>
                  <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                    <Icon name="mapPin" size={12} /> 27.52° N, 84.35° E
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl">
                  <div className="text-[10px] text-white/90 font-bold uppercase">Farm Health</div>
                  <div className="text-accent-green font-black text-sm">Excellent</div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-green/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-cream rounded-xl flex items-center justify-center border border-mountain-gray/10">
                  <Icon name="cpu" size={24} className="text-primary-green" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-mountain-gray uppercase tracking-widest">AI Recommendation</div>
                  <div className="text-sm font-extrabold text-charcoal mt-0.5">Irrigate tomorrow at 6 AM</div>
                  <div className="text-xs text-soil-brown mt-0.5">Save 20% water based on soil moisture data.</div>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-bg-cream flex items-center justify-center hover:bg-mountain-gray/10 transition-colors text-charcoal">
                <Icon name="chevronRight" size={16} />
              </button>
            </div>
            
          </div>

          {/* Floating Smartphone Mockup (Absolute positioned) */}
          <div className="absolute -bottom-8 -right-4 lg:-right-8 w-48 h-80 bg-bg-cream rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border-4 border-charcoal overflow-hidden z-20 transform rotate-6 hover:rotate-0 hover:-translate-y-2 transition-all duration-500">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-charcoal rounded-b-xl z-30"></div>
            
            {/* Phone Screen App Interface */}
            <div className="w-full h-full bg-white relative flex flex-col pt-8 pb-4 px-3">
              <div className="flex items-center justify-between mb-4">
                <div className="w-6 h-6 bg-primary-green rounded-full"></div>
                <div className="text-[10px] font-extrabold text-charcoal">QR Scanner</div>
                <Icon name="menu" size={14} className="text-mountain-gray" />
              </div>
              
              <div className="flex-1 bg-bg-cream rounded-xl border border-soil-brown/10 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Scanning animation line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary-green shadow-[0_0_8px_2px_rgba(76,175,80,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                
                <div className="w-3/4 aspect-square border-2 border-dashed border-primary-green rounded-lg flex items-center justify-center">
                  <Icon name="maximize" size={32} className="text-primary-green/30" />
                </div>
                <div className="text-[10px] font-bold text-mountain-gray mt-4">Align QR within frame</div>
              </div>
              
              <div className="mt-3 bg-secondary-green/10 p-2 rounded-lg border border-secondary-green/20">
                <div className="text-[9px] font-bold text-primary-green">Last Scanned</div>
                <div className="text-[11px] font-black text-charcoal">Organic Basmati - Verified</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Traditional Nepali Border at Bottom */}
      <div className="w-full h-4 bg-primary-green opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #1B5E20 10px, #1B5E20 20px)' }}></div>
    </div>
  );
};

export default Home;
