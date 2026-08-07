import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '../components/Icons';
import MapPicker from '../components/MapPicker';
import { farmService, mockData } from '../services/api';

export const FarmDetails = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFarm = async () => {
      try {
        const farmRes = await farmService.getById(id || 'f-101');
        setFarm(farmRes);
        setCrops(mockData.crops);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFarm();
  }, [id]);

  if (loading || !farm) {
    return (
      <div className="p-8 text-center text-slate-500 font-semibold">
        Loading farm satellite analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eco-badge eco-badge-success">Active Plot</span>
            {farm.organic_certified && (
              <span className="eco-badge bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Certified Organic
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{farm.name}</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Icon name="mapPin" size={14} /> {farm.location} (GPS: {farm.latitude}, {farm.longitude})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/sustainability"
            className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
          >
            <Icon name="leaf" size={16} /> ESG Audit Score: {farm.sustainability_score}/100
          </Link>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Real Satellite Imagery Map View */}
          <div className="eco-card bg-slate-900 text-white space-y-3 p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Icon name="globe" size={18} className="text-emerald-400" />
                Live Multispectral NDVI Satellite View
              </h3>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold">
                0.82 High Vegetation Index
              </span>
            </div>

            {/* Satellite Map */}
            <MapPicker
              latitude={farm.latitude}
              longitude={farm.longitude}
              onLocationSelect={(lat, lng) => {
                setFarm({ ...farm, latitude: lat, longitude: lng });
              }}
            />
          </div>

          {/* Active Crops Table */}
          <div className="eco-card bg-white">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="sprout" size={18} className="text-emerald-600" /> Active Crops & Harvest Schedule
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Crop Variety</th>
                    <th className="p-3">Planted</th>
                    <th className="p-3">Est. Harvest</th>
                    <th className="p-3">Yield Est.</th>
                    <th className="p-3">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {crops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{crop.name} ({crop.variety})</td>
                      <td className="p-3">{crop.planting_date}</td>
                      <td className="p-3">{crop.expected_harvest}</td>
                      <td className="p-3 font-semibold text-emerald-700">{crop.yield_kg.toLocaleString()} kg</td>
                      <td className="p-3">
                        <span className="eco-badge eco-badge-success text-[10px]">
                          {crop.health_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="eco-card bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Plot Specifications</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Land Area</span>
                <span className="font-bold text-slate-800">{farm.area_hectares} Hectares</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Soil Composition</span>
                <span className="font-bold text-slate-800">{farm.soil_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Irrigation Method</span>
                <span className="font-bold text-slate-800">{farm.irrigation_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Organic Status</span>
                <span className="font-bold text-emerald-700">Certified Organic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetails;
