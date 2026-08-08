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
  const isNe = language === 'ne';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white text-slate-800 border-b border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        
        {/* Left: Mobile Sidebar Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 lg:hidden transition"
            aria-label={t('Open Navigation Menu', 'नेभिगेसन मेनु खोल्नुहोस्')}
          >
            <Icon name="activity" size={20} />
          </button>

          {/* Optimized Modern Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center w-full relative">
            <Icon name="search" size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('Search crops, fields, weather, advice...', 'बाली, जग्गा, मौसम, सल्लाह खोज्नुहोस्...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/90 border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#013822] focus:border-transparent focus:bg-white transition font-medium shadow-2xs"
            />
          </form>
        </div>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 ml-4">

          {/* Global Language Toggle Button Pill */}
          <button
            onClick={toggleLanguage}
            title={t('Switch to Nepali', 'अंग्रेजीमा स्विच गर्नुहोस्')}
            className="flex items-center p-1 text-xs font-black rounded-full border border-slate-200 bg-slate-100 transition select-none shadow-2xs"
          >
            <span className={`px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-[#013822] text-white shadow-2xs font-extrabold' : 'text-slate-600 font-bold'}`}>
              EN
            </span>
            <span className={`px-3 py-1 rounded-full transition-all ${language === 'ne' ? 'bg-[#013822] text-white shadow-2xs font-extrabold' : 'text-slate-600 font-bold'}`}>
              नेपाली
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-700 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 transition"
              aria-label={t('Alerts', 'सूचनाहरू')}
            >
              <Icon name="bell" size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                3
              </span>
            </button>
            {showNotifications && (
              <Notifications onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Profile Dropdown Pill */}
          <Link to="/profile" className="flex items-center gap-2.5 p-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-2xs overflow-hidden border border-emerald-800">
              🌾
            </div>
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-black text-slate-900 leading-tight">
                {user?.displayName || (isNe ? 'ग्रीन होराइजन फार्म' : 'Green Horizon Farm')}
              </div>
              <div className="text-[10px] font-bold text-slate-400">
                {isNe ? 'प्रमाणित फार्म' : 'Verified Farm'}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 pr-1">▼</span>
          </Link>

          {/* Logout if logged in */}
          {user && (
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 bg-slate-50 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-1 font-bold text-xs"
              title={t('Sign Out', 'बाहिर निस्किनुहोस्')}
            >
              <Icon name="logOut" size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
