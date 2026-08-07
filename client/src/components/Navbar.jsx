import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icons';
import Notifications from './Notifications';

export const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs pt-1.5">
      {/* Decorative Traditional Border Accent (Subtle Dhaka pattern styling) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-blue-700 to-emerald-600"></div>

      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left Side: Brand Logo & Navigation Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Icon name="activity" size={22} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 text-emerald-600 font-extrabold text-xl sm:text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Icon name="sprout" size={24} />
            </div>
            <span className="flex items-center gap-1.5">
              Eco<span className="text-slate-900">Trace</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                🇳🇵 Nepal
              </span>
            </span>
          </Link>
        </div>

        {/* Friendly Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <Icon name="search" size={18} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="🔍 Search crops, fields, earnings, or weather..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
          />
        </form>

        {/* Right Side: Quick Action Buttons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/farms/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-xs"
          >
            <Icon name="plus" size={16} /> <span className="hidden sm:inline">+ Add Field</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              aria-label="Alerts"
              title="Alerts & Weather Updates"
            >
              <Icon name="bell" size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            {showNotifications && (
              <Notifications onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Profile */}
          <Link to="/profile" className="flex items-center gap-2.5 p-1 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              🌾
            </div>
            <div className="hidden lg:block text-left pr-2">
              <div className="text-xs font-bold text-slate-900">{user?.displayName || 'My Farm Account'}</div>
              <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                <Icon name="checkCircle" size={10} /> Verified Farmer
              </div>
            </div>
          </Link>

          {/* Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="p-2.5 text-slate-600 bg-slate-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition flex items-center gap-1.5 font-bold text-xs shadow-xs"
              title="Sign Out"
            >
              <Icon name="logOut" size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
