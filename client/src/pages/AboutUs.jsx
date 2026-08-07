import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-bg-cream text-charcoal font-sans relative overflow-hidden pb-12">
      {/* Floating Navbar (Simplified to match Home) */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo2.png" alt="Krishi Saarathi Logo" className="w-12 h-12 object-contain drop-shadow-sm" />
          <span className="font-extrabold text-xl text-primary-green tracking-tight hidden sm:block">
            Krishi <span className="text-charcoal">Saarathi</span>
          </span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 text-mountain-gray hover:text-primary-green text-sm font-bold transition">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2 bg-primary-green hover:bg-secondary-green text-white rounded-full text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5">
            My Dashboard
          </Link>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-mountain-gray/10 text-primary-green rounded-full text-xs font-bold uppercase tracking-wider shadow-sm mb-6">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-charcoal leading-tight mb-6">
          Rewarding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-accent-green">Sustainable</span> Farming
        </h1>
        <div className="bg-white p-8 rounded-3xl border border-mountain-gray/10 shadow-sm">
          <p className="text-base text-mountain-gray leading-relaxed font-medium">
            <strong>Krishi Saarathi</strong> was developed to make Nepal's naturally sustainable farming economically rewarding. For generations, traditional Nepali farming has protected our nature, yet farmers rarely receive financial recognition for these invaluable practices. We bridge this gap by combining modern technology with traditional agriculture. Through AI and satellite verification, we assess farm health and soil quality without expensive manual inspections. By implementing QR traceability, we connect consumers with the origin of their food. Most importantly, we open carbon credit opportunities to reward sustainable farmers directly. Our mission is to strengthen local agriculture, reduce our dependence on imports, and make healthy, local food more accessible and affordable for everyone.
          </p>
        </div>
      </div>

      {/* How It Works (4-step journey) */}
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-charcoal">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-mountain-gray/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-bg-cream flex items-center justify-center text-primary-green mb-4">
              <Icon name="userPlus" size={24} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">1. Farm Registration</h3>
            <p className="text-sm text-mountain-gray font-medium">Farmers easily onboard their land profiles and crop details into the platform.</p>
            <div className="hidden md:block absolute top-12 right-0 w-8 border-t-2 border-dashed border-mountain-gray/20 translate-x-3"></div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-mountain-gray/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-bg-cream flex items-center justify-center text-primary-green mb-4">
              <Icon name="satellite" size={24} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">2. AI Sustainability</h3>
            <p className="text-sm text-mountain-gray font-medium">Satellite data and AI continuously monitor soil health and verify sustainable practices.</p>
            <div className="hidden md:block absolute top-12 right-0 w-8 border-t-2 border-dashed border-mountain-gray/20 translate-x-3"></div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-mountain-gray/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-bg-cream flex items-center justify-center text-primary-green mb-4">
              <Icon name="maximize" size={24} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">3. QR Traceability</h3>
            <p className="text-sm text-mountain-gray font-medium">Products get QR passports and hit the marketplace, ensuring transparency for buyers.</p>
            <div className="hidden md:block absolute top-12 right-0 w-8 border-t-2 border-dashed border-mountain-gray/20 translate-x-3"></div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-mountain-gray/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-bg-cream flex items-center justify-center text-golden-harvest mb-4">
              <Icon name="award" size={24} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">4. Carbon Rewards</h3>
            <p className="text-sm text-mountain-gray font-medium">Verified environmental impact is minted as carbon credits to reward the farmer.</p>
          </div>
        </div>
      </div>

      {/* Project Credits Footer */}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center relative z-10">
        <div className="pt-8 border-t border-mountain-gray/10 flex flex-col items-center justify-center space-y-1">
          <p className="text-[11px] font-bold text-mountain-gray uppercase tracking-wider">Designed & Developed by</p>
          <p className="text-xs text-charcoal font-medium">Amrit Paudel · Sadikshya Adhikari · Shiva Laudari · Ayush Dahal</p>
          <p className="text-[10px] text-mountain-gray italic">B.Sc. CSIT Students, Nepal</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
