import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import MapPicker from '../components/MapPicker';
import { farmService } from '../services/api';

export const FarmRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: 'Chitwan Valley, Nepal',
    latitude: 27.5291,
    longitude: 84.3542,
    area_hectares: '10.0',
    soil_type: 'Loamy Clay',
    irrigation_type: 'Drip & Solar Pump',
    organic_certified: true,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  // Quick Regional Location Presets
  const locationPresets = [
    { label: 'Chitwan Valley', lat: 27.5291, lng: 84.3542 },
    { label: 'Pokhara Region', lat: 28.2096, lng: 83.9856 },
    { label: 'Mustang Orchard', lat: 28.7831, lng: 83.7431 },
    { label: 'Kathmandu Valley', lat: 27.7172, lng: 85.324 },
    { label: 'Terai Belt', lat: 26.8124, lng: 87.2835 },
  ];

  // Callback from Leaflet MapPicker component
  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  // Detect live GPS location from browser device
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: `GPS Field Location (${lat}, ${lng})`,
        }));
        setDetectingGps(false);
        alert(`📍 GPS Location Detected!\nLatitude: ${lat}, Longitude: ${lng}`);
      },
      (err) => {
        console.error(err);
        setDetectingGps(false);
        alert('Could not access GPS location. Please choose on the map or type manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      location: preset.label,
      latitude: preset.lat,
      longitude: preset.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await farmService.create({
        ...formData,
        area_hectares: parseFloat(formData.area_hectares) || 10.0,
      });
      alert('✅ Field registered successfully! AI satellite baseline scan initialized.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to register farm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            🌾
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Register New Field Plot</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Pick your exact field location on the satellite map or use your device GPS.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Field Name & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Field Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Green Valley Field A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Region / Location Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chitwan Valley, Nepal"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Real Satellite Map Picker Component */}
          <div className="space-y-3 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Icon name="mapPin" size={18} className="text-emerald-400" />
                  Real Satellite Map & Field Selector
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Zoom in and click anywhere on green farm fields to set GPS coordinates:
                </p>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={detectingGps}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Icon name="mapPin" size={14} />
                {detectingGps ? 'Finding GPS Location...' : '📍 Use My GPS Location'}
              </button>
            </div>

            {/* Leaflet Satellite Map Component */}
            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationSelect={handleLocationSelect}
            />

            {/* Quick Regional Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-300">Quick Regional Presets:</span>
              {locationPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold rounded-lg border border-slate-700 transition"
                >
                  📍 {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Latitude & Longitude Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Land Area (Hectares) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="10.0"
                value={formData.area_hectares}
                onChange={(e) => setFormData({ ...formData, area_hectares: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Latitude (GPS) *</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50/60 font-extrabold text-emerald-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Longitude (GPS) *</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50/60 font-extrabold text-emerald-950"
              />
            </div>
          </div>

          {/* Soil Type & Irrigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Soil Type</label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
              >
                <option value="Loamy Clay">Loamy Clay (Best for Crops)</option>
                <option value="Alluvial">Alluvial (River Basin Soil)</option>
                <option value="Silty Sand">Silty Sand</option>
                <option value="Peat / Organic">Peat / Organic Rich</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Irrigation System</label>
              <select
                value={formData.irrigation_type}
                onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
              >
                <option value="Drip & Solar Pump">Drip & Solar Pump (Water Saving)</option>
                <option value="Rainfed & Canal">Rainfed & Canal</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Traditional Flooding">Traditional Flooding</option>
              </select>
            </div>
          </div>

          {/* Organic Certification Checkbox */}
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <input
              type="checkbox"
              id="organic"
              checked={formData.organic_certified}
              onChange={(e) => setFormData({ ...formData, organic_certified: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="organic" className="text-xs font-extrabold text-emerald-950 cursor-pointer">
              🌿 Farm possesses Organic / Pesticide-Free Certification
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Field Description & Crops Planned</label>
            <textarea
              rows="3"
              placeholder="e.g. Organic Basmati Rice crop rotation with vermicompost soil treatment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl hover:bg-emerald-700 transition inline-flex items-center gap-2 shadow-md"
            >
              {loading ? 'Initializing Satellite Mapping...' : '✅ Save & Register Field Plot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmRegistration;
