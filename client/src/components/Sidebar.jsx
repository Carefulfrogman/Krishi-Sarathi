import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icons';

export const Sidebar = ({ user, isOpen, onClose }) => {
  const isBuyer = user?.role === 'buyer';

  const menuGroups = isBuyer
    ? [
        {
          title: '💼 BUYER COMMAND CENTER',
          items: [
            { path: '/buyer/dashboard', label: 'Buyer Dashboard', icon: 'trendingUp' },
            { path: '/marketplace', label: 'Carbon Trade Market', icon: 'dollarSign' },
            { path: '/supplychain', label: 'Logistics & QR Tracker', icon: 'truck' },
          ],
        },
        {
          title: '👤 ACCOUNT & INFO',
          items: [
            { path: '/about', label: 'About Krishi Saarathi', icon: 'globe' },
            { path: '/profile', label: 'My Profile', icon: 'user' },
            { path: '/settings', label: 'Settings', icon: 'settings' },
          ],
        },
      ]
    : [
        {
          title: '🌾 FARMER COMMAND CENTER',
          items: [
            { path: '/dashboard', label: 'Dashboard', icon: 'activity' },
            { path: '/assistant', label: 'AI Farm Assistant', icon: 'user' },
            { path: '/farms/register', label: 'Add New Field', icon: 'plus' },
            { path: '/farms/f-101', label: 'Field Details & Crops', icon: 'sprout' },
          ],
        },
        {
          title: '💚 HEALTH & MARKET',
          items: [
            { path: '/sustainability', label: 'Sustainability Calculator', icon: 'leaf' },
            { path: '/carbon', label: 'Carbon Earnings', icon: 'award' },
            { path: '/list-product', label: 'Sell / List Product', icon: 'plus' },
            { path: '/marketplace', label: 'Carbon Trade Market', icon: 'dollarSign' },
          ],
        },
        {
          title: '🛡️ RISK & LOGISTICS',
          items: [
            { path: '/insurance', label: 'Crop Insurance', icon: 'shield' },
            { path: '/disasters', label: 'Weather Alerts', icon: 'alertTriangle' },
            { path: '/supplychain', label: 'Delivery & QR Tracker', icon: 'truck' },
          ],
        },
        {
          title: '👤 ACCOUNT & INFO',
          items: [
            { path: '/about', label: 'About Krishi Saarathi', icon: 'globe' },
            { path: '/profile', label: 'My Profile', icon: 'user' },
            { path: '/settings', label: 'Settings', icon: 'settings' },
          ],
        },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 pt-16 lg:pt-0 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <div className="px-3 mb-2 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
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
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
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

          {/* Bottom Card depending on role */}
          {!isBuyer ? (
            <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl text-white shadow-md mt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                <Icon name="sprout" size={18} /> Level 4 Farmer
              </div>
              <p className="text-xs mt-1.5 text-emerald-100 leading-relaxed font-medium">
                Your fields scored <strong className="text-white font-extrabold">92/100 (Healthy)</strong> this season!
              </p>
              <NavLink
                to="/rewards"
                className="mt-3 block text-center py-2 px-3 bg-white text-emerald-900 text-xs font-extrabold rounded-xl shadow-xs hover:bg-emerald-50 transition"
              >
                🎁 Claim Eco Bonus
              </NavLink>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-br from-blue-600 to-teal-800 rounded-2xl text-white shadow-md mt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                <Icon name="award" size={18} /> Premium Sourcing Partner
              </div>
              <p className="text-xs mt-1.5 text-blue-100 leading-relaxed font-medium">
                You offset <strong className="text-white font-extrabold">840 kg CO2</strong> this quarter!
              </p>
              <NavLink
                to="/marketplace"
                className="mt-3 block text-center py-2 px-3 bg-white text-blue-900 text-xs font-extrabold rounded-xl shadow-xs hover:bg-blue-50 transition"
              >
                🌱 Sourced Batches
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
