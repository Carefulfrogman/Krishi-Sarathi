import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ user, isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const isNe = language === 'ne';
  const isBuyer = user?.role === 'buyer';

  const menuItems = isBuyer
    ? [
        { path: '/buyer/dashboard', en: 'Buyer Dashboard', ne: 'खरिदकर्ता ड्यासबोर्ड', icon: 'trendingUp' },
        { path: '/marketplace', en: 'Carbon Trade Market', ne: 'कार्बन व्यापार बजार', icon: 'dollarSign' },
        { path: '/supplychain', en: 'Logistics & QR Tracker', ne: 'लजिस्टिक्स र QR ट्र्याकर', icon: 'truck' },
        { path: '/about', en: 'About EcoTrace', ne: 'इकोट्रेसको बारेमा', icon: 'globe' },
        { path: '/profile', en: 'My Profile', ne: 'मेरो प्रोफाइल', icon: 'user' },
        { path: '/settings', en: 'Settings', ne: 'सेटिङहरू', icon: 'settings' },
      ]
    : [
        { path: '/dashboard', en: 'Dashboard', ne: 'ड्यासबोर्ड', icon: 'activity' },
        { path: '/assistant', en: 'AI Farm Assistant', ne: 'एआई फार्म सहायक', icon: 'user' },
        { path: '/farms/f-101', en: 'Fields & Crops', ne: 'खेतबारी र बाली', icon: 'sprout' },
        { path: '/sustainability', en: 'Sustainability', ne: 'दिगोपन', icon: 'leaf' },
        { path: '/carbon', en: 'Carbon Earnings', ne: 'कार्बन आम्दानी', icon: 'award' },
        { path: '/list-product', en: 'Sell / List Product', ne: 'उत्पादन बेच्नुहोस्', icon: 'plus' },
        { path: '/rewards', en: 'Rewards & Points', ne: 'पुरस्कार र अंक', icon: 'award' },
        { path: '/insurance', en: 'Crop Insurance', ne: 'बाली बीमा', icon: 'shield' },
        { path: '/disasters', en: 'Weather Alerts', ne: 'मौसम सूचना', icon: 'alertTriangle' },
        { path: '/supplychain', en: 'Delivery & QR Tracker', ne: 'डेलिभरी र ट्र्याकर', icon: 'truck' },
        { path: '/reports', en: 'Reports & Analytics', ne: 'रिपोर्ट र विश्लेषण', icon: 'globe' },
        { path: '/settings', en: 'Settings', ne: 'सेटिङहरू', icon: 'settings' },
      ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#013822] text-white border-r border-[#00573A]/40 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo fills sidebar width tightly */}
        <div className="bg-white shrink-0 border-b border-slate-200">
          <NavLink to="/dashboard" onClick={onClose} className="block w-full">
            <img
              src="/krishi-logo.png"
              alt="Krishi Saarathi - कृषि सारथी"
              className="w-full h-auto object-contain block"
            />
          </NavLink>
        </div>

        {/* Navigation List - Strictly English when in EN mode, Strictly Nepali when in NE mode */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white text-[#013822] shadow-md font-extrabold ring-1 ring-white/20'
                      : 'text-white/85 hover:bg-white/10 hover:text-white font-bold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} size={20} className={isActive ? 'text-[#013822]' : 'text-white/90'} />
                    <span className="text-xs font-black tracking-tight">
                      {isNe ? item.ne : item.en}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Help & Support Box - Dynamic Single Language */}
        <div className="p-3.5 shrink-0 bg-[#01301e] border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-[#F8F7F1] text-[#013822] border border-[#B4B394]/40 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#013822]/10 text-[#013822] flex items-center justify-center text-xl shrink-0 font-bold">
              🎧
            </div>
            <div>
              <div className="text-xs font-black text-[#013822] leading-tight">
                {t('Need Help?', 'सहायता चाहिन्छ?')}
              </div>
              <div className="text-[10px] text-slate-600 font-bold mt-0.5">
                {t('Contact Support', 'सम्पर्क समर्थन')}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
