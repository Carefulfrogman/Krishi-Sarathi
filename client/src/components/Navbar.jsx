import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icons';
import Notifications from './Notifications';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#063822] text-white border-b border-[#B4B394]/30 shadow-md">
      {/* Decorative Accent Trim */}
      <div className="h-1 bg-gradient-to-r from-[#D99A17] via-[#7B8428] to-[#174F32]"></div>

      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Brand + Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-white/90 bg-white/10 rounded-xl hover:bg-white/20 lg:hidden transition"
            aria-label={t('Open Navigation Menu', 'नेभिगेसन मेनु खोल्नुहोस्')}
          >
            <Icon name="activity" size={22} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 font-extrabold text-xl sm:text-2xl tracking-tight text-white">
            <div className="w-10 h-10 rounded-2xl bg-[#174F32] flex items-center justify-center text-white shadow-md border border-[#B4B394]/40">
              <Icon name="sprout" size={24} />
            </div>
            <span className="flex items-center gap-1.5 font-black">
              Eco<span className="text-[#D99A17]">Trace</span>
              <span className="text-[10px] bg-white/15 text-white font-bold px-2 py-0.5 rounded border border-white/20">
                🇳🇵 Nepal
              </span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <Icon name="search" size={18} className="absolute left-3.5 text-white/60" />
          <input
            type="text"
            placeholder={t('🔍 Search crops, fields, earnings, weather...', '🔍 बाली, जग्गा, आम्दानी, मौसम खोज्नुहोस्...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#D99A17] transition font-medium"
          />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ── Global Language Toggle ── */}
          <button
            onClick={toggleLanguage}
            title={t('Switch to Nepali', 'अंग्रेजीमा स्विच गर्नुहोस्')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border-2 transition hover:scale-105 active:scale-95 select-none"
            style={{
              backgroundColor: language === 'ne' ? '#D99A17' : 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              borderColor: '#D99A17',
            }}
          >
            {language === 'ne' ? (
              <>🇬🇧 <span>EN</span></>
            ) : (
              <>🇳🇵 <span>नेपाली</span></>
            )}
          </button>

          {/* Add Field */}
          <Link
            to="/farms/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#174F32] hover:bg-[#063822] text-white rounded-xl transition shadow-xs border border-[#B4B394]/30"
          >
            <Icon name="plus" size={16} />
            <span className="hidden sm:inline">{t('+ Add Field', '+ जग्गा थप्नुहोस्')}</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-white/90 bg-white/10 rounded-xl hover:bg-white/20 transition"
              aria-label={t('Alerts', 'सूचनाहरू')}
            >
              <Icon name="bell" size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D99A17] rounded-full ring-2 ring-[#063822] animate-pulse"></span>
            </button>
            {showNotifications && (
              <Notifications onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Profile */}
          <Link to="/profile" className="flex items-center gap-2.5 p-1 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition text-white">
            <div className="w-9 h-9 rounded-lg bg-[#174F32] text-white font-bold flex items-center justify-center text-sm shadow-xs border border-[#B4B394]/40">
              🌾
            </div>
            <div className="hidden lg:block text-left pr-2">
              <div className="text-xs font-bold text-white">{user?.displayName || t('My Farm Account', 'मेरो फार्म खाता')}</div>
              <div className="text-[10px] font-semibold text-[#B4B394] flex items-center gap-1">
                <Icon name="checkCircle" size={10} /> {t('Verified Farmer', 'प्रमाणित किसान')}
              </div>
            </div>
          </Link>

          {/* Logout */}
          {user && (
            <button
              onClick={onLogout}
              className="p-2 text-white/80 bg-white/10 rounded-xl hover:bg-red-600 hover:text-white transition flex items-center gap-1.5 font-bold text-xs"
              title={t('Sign Out', 'बाहिर निस्किनुहोस्')}
            >
              <Icon name="logOut" size={18} />
              <span className="hidden md:inline">{t('Logout', 'लगआउट')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
