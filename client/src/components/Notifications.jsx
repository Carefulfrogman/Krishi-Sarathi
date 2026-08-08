import React, { useState } from 'react';
import Icon from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Notifications = ({ onClose }) => {
  const { t } = useLanguage();

  const [items, setItems] = useState([
    {
      id: 1,
      titleEn: 'Satellite Health Scan',
      titleNe: 'स्याटेलाइट स्वास्थ्य स्क्यान',
      messageEn: 'Green Horizon crop index reached 94% optimal health.',
      messageNe: 'ग्रिन होराइजनको बाली सूचकांक ९४% इष्टतम स्वास्थ्यमा पुग्यो।',
      time: '10m',
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      titleEn: 'Carbon Trade Completed',
      titleNe: 'कार्बन व्यापार सम्पन्न',
      messageEn: 'Sold 10 carbon credits to Himalayan BioTech for $250.00.',
      messageNe: 'हिमालयन बायोटेकलाई १० कार्बन क्रेडिट $२५०.०० मा बेचियो।',
      time: '2h',
      unread: true,
      type: 'info',
    },
    {
      id: 3,
      titleEn: 'Weather Rain Warning',
      titleNe: 'मौसम वर्षा चेतावनी',
      messageEn: 'Precipitation expected in Chitwan zone on Tuesday.',
      messageNe: 'मंगलबार चितवन क्षेत्रमा वर्षा हुने अनुमान छ।',
      time: '1d',
      unread: false,
      type: 'warning',
    },
  ]);

  const markAllRead = () =>
    setItems(items.map((i) => ({ ...i, unread: false })));

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
          <Icon name="bell" size={16} className="text-[#174F32]" />
          {t('Notifications', 'सूचनाहरू')}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="text-[11px] text-[#174F32] font-semibold hover:underline">
            {t('Mark all read', 'सबै पढिएको चिन्ह लगाउनुहोस्')}
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
              <span className="font-bold text-slate-800">{t(item.titleEn, item.titleNe)}</span>
              <span className="text-[10px] text-slate-400">{item.time} {t('ago', 'पहिले')}</span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">{t(item.messageEn, item.messageNe)}</p>
          </div>
        ))}
      </div>

      <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">
          {t('Krishi Saarathi Real-time AI Event Engine', 'कृषि सारथी रियल-टाइम एआई इभेन्ट इन्जिन')}
        </span>
      </div>
    </div>
  );
};

export default Notifications;
