import React, { useState } from 'react';
import Icon from '../components/Icons';
import { mockData } from '../services/api';

export const DisasterReport = () => {
  const [disasters, setDisasters] = useState(mockData.disasters);
  const [newType, setNewType] = useState('Heavy Flash Flood Alert');
  const [location, setLocation] = useState('Chitwan Riverbed');

  const handleReport = (e) => {
    e.preventDefault();
    const item = {
      id: `DIS-${Math.floor(Math.random() * 900 + 100)}`,
      type: newType,
      severity: 'High',
      location,
      date: new Date().toISOString().split('T')[0],
      affected_area: '15 Hectares',
      status: 'Under Verification',
    };
    setDisasters([item, ...disasters]);
    alert('Disaster emergency alert broadcasted to agricultural authorities & satellite monitoring center!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-2xl border border-rose-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Emergency Hazard Monitoring
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Disaster Alert & Early Warning Portal</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time hazard reporting for floods, pest outbreaks, heatwaves, and extreme weather.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Disasters List */}
        <div className="md:col-span-2 eco-card bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="alertTriangle" size={18} className="text-rose-600" /> Active Regional Emergency Alerts
          </h3>

          <div className="space-y-3">
            {disasters.map((d) => (
              <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{d.type}</h4>
                    <span className={`eco-badge text-[10px] ${d.severity === 'High' ? 'eco-badge-danger' : 'eco-badge-warning'}`}>
                      {d.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Icon name="mapPin" size={12} /> Location: {d.location} • Area: {d.affected_area}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold">{d.date}</div>
                  <div className="text-xs font-bold text-rose-700 mt-0.5">{d.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Hazard Form */}
        <div className="eco-card bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="plus" size={18} className="text-rose-600" /> Report Hazard Event
          </h3>

          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hazard Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-semibold"
              >
                <option value="Heavy Flash Flood Alert">Heavy Flash Flood Alert</option>
                <option value="Pest Outbreak (Armyworm/Locust)">Pest Outbreak (Armyworm/Locust)</option>
                <option value="Severe Drought Heatwave">Severe Drought Heatwave</option>
                <option value="Landslide / Soil Erosion">Landslide / Soil Erosion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affected Location / Sector</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="alertTriangle" size={16} /> Broadcast Emergency Alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisasterReport;
