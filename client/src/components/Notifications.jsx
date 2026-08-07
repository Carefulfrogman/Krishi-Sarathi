import React, { useState } from 'react';
import Icon from './Icons';

export const Notifications = ({ onClose }) => {
  const [items, setItems] = useState([
    { id: 1, title: 'Satellite Health Scan', message: 'Green Horizon crop index reached 94% optimal health.', time: '10m ago', unread: true, type: 'success' },
    { id: 2, title: 'Carbon Trade Completed', message: 'Sold 10 carbon credits to Himalayan BioTech for $250.00.', time: '2h ago', unread: true, type: 'info' },
    { id: 3, title: 'Weather Rain Warning', message: 'Precipitation expected in Chitwan zone on Tuesday.', time: '1d ago', unread: false, type: 'warning' },
  ]);

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, unread: false })));
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
          <Icon name="bell" size={16} className="text-emerald-600" /> Notifications
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-[11px] text-emerald-600 font-semibold hover:underline"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Icon name="x" size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 text-xs transition hover:bg-slate-50 ${item.unread ? 'bg-emerald-50/40' : ''}`}
          >
            <div className="flex items-start justify-between">
              <span className="font-bold text-slate-800">{item.title}</span>
              <span className="text-[10px] text-slate-400">{item.time}</span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">{item.message}</p>
          </div>
        ))}
      </div>

      <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">Krishi Saarathi Real-time AI Event Engine</span>
      </div>
    </div>
  );
};

export default Notifications;
