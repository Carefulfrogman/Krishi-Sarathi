import React, { useState } from 'react';
import Icon from '../components/Icons';

export const Settings = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('System settings updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">System Preferences & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure backend connections, API endpoints, and notification alerts.</p>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="eco-card bg-slate-50 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon name="settings" size={16} className="text-emerald-600" /> Backend API Server Endpoint
            </h3>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            />
            <p className="text-[11px] text-slate-400">Default endpoint for FastAPI server.</p>
          </div>

          <div className="eco-card bg-slate-50 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon name="bell" size={16} className="text-emerald-600" /> Real-time Alert Triggers
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notif"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="notif" className="text-xs font-semibold text-slate-800">
                Receive satellite crop health drop warnings & weather flash flood alerts
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
