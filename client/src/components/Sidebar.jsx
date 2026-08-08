import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ user, isOpen, onClose }) => {
  const { t } = useLanguage();
  const isBuyer = user?.role === 'buyer';

  const menuGroups = isBuyer
    ? [
        {
          title: t('💼 BUYER COMMAND CENTER', '💼 खरिदकर्ता केन्द्र'),
          items: [
            { path: '/buyer/dashboard', label: t('Buyer Dashboard', 'खरिदकर्ता ड्यासबोर्ड'), icon: 'trendingUp' },
            { path: '/marketplace', label: t('Carbon Trade Market', 'कार्बन व्यापार बजार'), icon: 'dollarSign' },
            { path: '/supplychain', label: t('Logistics & QR Tracker', 'लजिस्टिक्स र QR ट्र्याकर'), icon: 'truck' },
          ],
        },
        {
          title: t('👤 ACCOUNT & INFO', '👤 खाता र जानकारी'),
          items: [
            { path: '/about', label: t('About EcoTrace', 'इकोट्रेसको बारेमा'), icon: 'globe' },
            { path: '/profile', label: t('My Profile', 'मेरो प्रोफाइल'), icon: 'user' },
            { path: '/settings', label: t('Settings', 'सेटिङहरू'), icon: 'settings' },
          ],
        },
      ]
    : [
        {
          title: t('🌾 FARMER COMMAND CENTER', '🌾 कृषक केन्द्र'),
          items: [
            { path: '/dashboard', label: t('Dashboard', 'ड्यासबोर्ड'), icon: 'activity' },
            { path: '/assistant', label: t('AI Farm Assistant', 'एआई कृषि सहायक'), icon: 'user' },
            { path: '/farms/register', label: t('Add New Field', 'नयाँ जग्गा थप्नुहोस्'), icon: 'plus' },
            { path: '/farms/f-101', label: t('Field Details & Crops', 'बाली र जग्गा विवरण'), icon: 'sprout' },
          ],
        },
        {
          title: t('💚 HEALTH & MARKET', '💚 स्वास्थ्य र बजार'),
          items: [
            { path: '/sustainability', label: t('Sustainability Calculator', 'दीगोपन क्याल्कुलेटर'), icon: 'leaf' },
            { path: '/carbon', label: t('Carbon Earnings', 'कार्बन आम्दानी'), icon: 'award' },
            { path: '/list-product', label: t('Sell / List Product', 'उत्पादन बिक्री सूची'), icon: 'plus' },
            { path: '/marketplace', label: t('Carbon Trade Market', 'कार्बन व्यापार बजार'), icon: 'dollarSign' },
          ],
        },
        {
          title: t('🛡️ RISK & LOGISTICS', '🛡️ जोखिम र लजिस्टिक्स'),
          items: [
            { path: '/insurance', label: t('Crop Insurance', 'बाली बीमा सल्लाहकार'), icon: 'shield' },
            { path: '/disasters', label: t('Weather Alerts', 'मौसम चेतावनी'), icon: 'alertTriangle' },
            { path: '/supplychain', label: t('Delivery & QR Tracker', 'डेलिभरी र QR ट्र्याकर'), icon: 'truck' },
          ],
        },
        {
          title: t('👤 ACCOUNT & INFO', '👤 खाता र जानकारी'),
          items: [
            { path: '/about', label: t('About EcoTrace', 'इकोट्रेसको बारेमा'), icon: 'globe' },
            { path: '/profile', label: t('My Profile', 'मेरो प्रोफाइल'), icon: 'user' },
            { path: '/settings', label: t('Settings', 'सेटिङहरू'), icon: 'settings' },
          ],
        },
      ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#17251D]/50 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-[#E5E8E3] pt-16 lg:pt-0 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <div className="px-3 mb-2 text-[11px] font-extrabold tracking-wider text-[#7B8428] uppercase">
                  {group.title}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold rounded-xl transition ${
                          isActive
                            ? 'bg-[#174F32] text-white shadow-xs'
                            : 'text-[#17251D] hover:bg-[#F8F7F1] hover:text-[#063822]'
                        }`
                      }
                    >
                      <Icon name={item.icon} size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom promo card */}
          {!isBuyer ? (
            <div className="p-4 rounded-2xl text-white shadow-md mt-6 border border-[#B4B394]/30" style={{ background: 'linear-gradient(135deg, #063822, #174F32)' }}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B4B394]">
                <Icon name="sprout" size={18} /> {t('Level 4 Farmer', 'तह ४ कृषक')}
              </div>
              <p className="text-xs mt-1.5 text-white/90 leading-relaxed font-medium">
                {t('Your fields scored', 'तपाईंको खेतको प्राप्ताङ्क')} <strong className="text-[#D99A17] font-extrabold">92/100</strong> {t('this season!', 'यस सिजनमा!')}
              </p>
              <NavLink
                to="/rewards"
                className="mt-3 block text-center py-2 px-3 bg-[#F8F7F1] text-[#063822] text-xs font-extrabold rounded-xl shadow-xs hover:bg-white transition border border-[#B4B394]"
              >
                🎁 {t('Claim Eco Bonus', 'इको बोनस लिनुहोस्')}
              </NavLink>
            </div>
          ) : (
            <div className="p-4 rounded-2xl text-white shadow-md mt-6 border border-[#B4B394]/30" style={{ background: 'linear-gradient(135deg, #063822, #7B8428)' }}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B4B394]">
                <Icon name="award" size={18} /> {t('Premium Partner', 'प्रिमियम पार्टनर')}
              </div>
              <p className="text-xs mt-1.5 text-white/90 leading-relaxed font-medium">
                {t('You offset', 'तपाईंले')} <strong className="text-[#D99A17] font-extrabold">840 kg CO₂</strong> {t('this quarter!', 'यस त्रैमासिकमा!')}
              </p>
              <NavLink
                to="/marketplace"
                className="mt-3 block text-center py-2 px-3 bg-[#F8F7F1] text-[#063822] text-xs font-extrabold rounded-xl shadow-xs hover:bg-white transition border border-[#B4B394]"
              >
                🌱 {t('Sourced Batches', 'स्रोतीकृत ब्याचहरू')}
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
