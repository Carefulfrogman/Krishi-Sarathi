import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [region, setRegion] = useState('Terai Plains');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignup) {
      onSignup({ displayName: farmName || fullName || 'Eco Farm Owner', email, role, region });
    }
    navigate(role === 'buyer' ? '/buyer/dashboard' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-accent-green opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-golden-harvest opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-lg border border-soil-brown/10 space-y-6 relative z-10 my-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleLanguage}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition"
            style={{ borderColor: '#D99A17', color: '#063822', backgroundColor: language === 'ne' ? '#D99A17' : 'transparent' }}
          >
            {language === 'ne' ? '🇬🇧 English' : '🇳🇵 नेपाली'}
          </button>
        </div>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white border border-soil-brown/20 flex items-center justify-center mx-auto shadow-sm overflow-hidden">
            <img src="/logo.jpg" alt="Krishi Saarathi Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-charcoal tracking-tight flex items-center justify-center gap-2">
            {t('Namaste', 'नमस्ते')} 🇳🇵 <span className="text-primary-green">{t('Krishi Saarathi', 'कृषि सारथी')}</span>
          </h1>
          <p className="text-xs text-mountain-gray">
            {t("Join Nepal's first carbon-neutral smart farming community", 'नेपालको पहिलो कार्बन-न्यूट्रल स्मार्ट खेती समुदायमा सामेल हुनुहोस्')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
                {t('Full Name', 'पूरा नाम')}
              </label>
              <input
                type="text"
                required
                placeholder={t('e.g. Ram Bahadur', 'जस्तै: राम बहादुर')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
                {t('Farm / Co-op Name', 'फार्म / सहकारी नाम')}
              </label>
              <input
                type="text"
                required
                placeholder={t('e.g. Mustang Organic Co-op', 'जस्तै: मुस्ताङ जैविक सहकारी')}
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
                {t('Agro-Ecological Region', 'कृषि-पारिस्थितिक क्षेत्र')}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none font-semibold"
              >
                <option value="Terai Plains">{t('Terai Plains (Chitwan, Jhapa, etc.)', 'तराई मैदान (चितवन, झापा, आदि)')}</option>
                <option value="Mid-Hills Region">{t('Mid-Hills Region (Pokhara, Kavre, etc.)', 'मध्य-पहाड क्षेत्र (पोखरा, काभ्रे, आदि)')}</option>
                <option value="Himalayan Highlands">{t('Himalayan Highlands (Mustang, Solukhumbu, etc.)', 'हिमाली उच्च भूमि (मुस्ताङ, सोलुखुम्बु, आदि)')}</option>
                <option value="Kathmandu Valley">{t('Kathmandu Valley (Urban Green Farming)', 'काठमाडौं उपत्यका (सहरी हरित खेती)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
                {t('Select Role', 'भूमिका छान्नुहोस्')}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none font-semibold"
              >
                <option value="farmer">🌾 {t('Farmer — Agro-Producers & Farm Owners', 'किसान — कृषि उत्पादक र फार्म मालिक')}</option>
                <option value="buyer">🛒 {t('Buyer — Retailers, Wholesalers & Organizations', 'खरिदकर्ता — खुद्रा, थोक र संस्थाहरू')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
              {t('Email Address', 'इमेल ठेगाना')}
            </label>
            <input
              type="email"
              required
              placeholder="farmer@krishisaarathi.ag"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">
              {t('Password', 'पासवर्ड')}
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-green hover:bg-secondary-green text-white font-bold text-xs rounded-xl transition shadow-md hover:-translate-y-0.5 mt-2"
          >
            {t('Create Account & Register Field', 'खाता बनाउनुहोस् र जग्गा दर्ता गर्नुहोस्')}
          </button>
        </form>

        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-mountain-gray">
            {t('Already have an account?', 'पहिले नै खाता छ?')}{' '}
            <Link to="/login" className="text-secondary-green hover:text-primary-green font-bold underline transition">
              {t('Sign In', 'साइन इन गर्नुहोस्')}
            </Link>
          </p>
        </div>

        <div className="text-center border-t border-soil-brown/10 pt-4 flex justify-between text-[10px] text-mountain-gray">
          <span>🌿 {t('Carbon Smart Farming', 'कार्बन स्मार्ट खेती')}</span>
          <span>🇳🇵 {t('Made for Himalayan Agro-ecosystems', 'हिमाली कृषि परिस्थितिका लागि')}</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
