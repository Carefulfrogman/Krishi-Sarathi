import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';

export const CarbonCreditCard = ({ stats }) => {
  return (
    <div className="bg-white border border-[#607D8B]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mountain-gray">
          <Icon name="award" size={18} className="text-primary-green" /> My Carbon Credits Balance
        </div>
        <span className="px-2.5 py-1 bg-secondary-green/20 text-charcoal border border-secondary-green/30 rounded-full text-[11px] font-extrabold">
          Ready to Sell
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-bg-cream rounded-xl border border-mountain-gray/10">
          <div className="text-[10px] text-soil-brown font-bold uppercase tracking-wider">Credits Available</div>
          <div className="text-2xl sm:text-3xl font-black text-primary-green mt-1">
            {stats?.credits_available || 140} <span className="text-xs font-bold text-mountain-gray">Units</span>
          </div>
        </div>

        <div className="p-4 bg-bg-cream rounded-xl border border-mountain-gray/10">
          <div className="text-[10px] text-soil-brown font-bold uppercase tracking-wider">Estimated Value</div>
          <div className="text-2xl sm:text-3xl font-black text-golden-harvest mt-1">
            ${(stats?.total_value_usd || 3430).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-mountain-gray/10 flex items-center justify-between mt-auto">
        <div className="text-xs text-soil-brown font-medium">
          Market Rate: <strong className="text-charcoal font-bold">${stats?.price_per_credit || 24.50} / credit</strong>
        </div>
        <Link
          to="/marketplace"
          className="px-4 py-2.5 bg-primary-green hover:bg-secondary-green text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
        >
          Sell Credits Now <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CarbonCreditCard;
