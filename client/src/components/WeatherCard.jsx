import React from 'react';
import Icon from './Icons';

export const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const isRainy = weather.condition.toLowerCase().includes('rain');

  return (
    <div className="eco-card bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700 relative overflow-hidden shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Icon name="mapPin" size={16} /> {weather.location}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">{weather.temperature}°C</span>
            <span className="text-sm text-slate-200 font-bold px-2.5 py-1 bg-slate-700/80 rounded-lg">
              {isRainy ? '🌧️ Rainy Weather' : '☀️ Sunny & Pleasant'}
            </span>
          </div>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-slate-700/80 border border-slate-600 flex items-center justify-center text-amber-400 shadow-md">
          <Icon name={isRainy ? 'cloud-rain' : 'sun'} size={34} />
        </div>
      </div>

      {/* 3 Main Farm Metrics */}
      <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-700/80 text-center">
        <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
          <div className="text-[11px] text-slate-300 uppercase font-bold flex items-center justify-center gap-1">
            💧 Rain Level
          </div>
          <div className="text-base font-extrabold text-white mt-1">{weather.rainfall_mm} mm</div>
        </div>

        <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
          <div className="text-[11px] text-slate-300 uppercase font-bold flex items-center justify-center gap-1">
            🌱 Soil Water
          </div>
          <div className="text-base font-extrabold text-emerald-400 mt-1">{weather.soil_moisture}</div>
        </div>

        <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
          <div className="text-[11px] text-slate-300 uppercase font-bold flex items-center justify-center gap-1">
            💨 Wind Speed
          </div>
          <div className="text-base font-extrabold text-white mt-1">{weather.wind_speed} km/h</div>
        </div>
      </div>

      {/* Simple Farmer Action Advisory */}
      <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-100 flex items-start gap-3 shadow-inner">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-base font-bold shadow-xs">
          💡
        </div>
        <div>
          <strong className="text-emerald-300 font-extrabold text-xs block uppercase">Farming Advice for Today:</strong>
          <p className="mt-0.5 leading-relaxed font-medium text-emerald-100">{weather.ai_advice}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
