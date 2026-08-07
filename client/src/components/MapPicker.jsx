import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icons';

export const MapPicker = ({ latitude, longitude, onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapType, setMapType] = useState('satellite'); // 'satellite' | 'street'

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    const initialLat = latitude || 27.5291;
    const initialLng = longitude || 84.3542;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on initial coordinates
    const map = window.L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
    });

    // High-Resolution Esri World Imagery Satellite Tile Layer
    const satelliteLayer = window.L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    // OpenStreetMap Standard Street View Layer
    const streetLayer = window.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    // Add selected initial tile layer
    if (mapType === 'satellite') {
      satelliteLayer.addTo(map);
    } else {
      streetLayer.addTo(map);
    }

    // Sleek slender GPS Pin Marker with tip anchoring
    const customIcon = window.L.divIcon({
      className: 'custom-leaflet-marker-sleek',
      html: `
        <div style="position: relative; width: 24px; height: 32px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
          <svg viewBox="0 0 24 32" width="24" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="#059669" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="11" r="4.5" fill="#ffffff"/>
          </svg>
          <div style="position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 10px; height: 3px; background: rgba(16,185,129,0.7); border-radius: 50%; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });

    const marker = window.L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    marker.bindPopup(`<b>📍 Selected Field Location</b><br>Lat: ${initialLat}, Lng: ${initialLng}`).openPopup();

    // Map Click Listener to Update Position
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const formattedLat = parseFloat(lat.toFixed(4));
      const formattedLng = parseFloat(lng.toFixed(4));

      marker.setLatLng([formattedLat, formattedLng]);
      marker.setPopupContent(`<b>📍 Selected Field Location</b><br>Lat: ${formattedLat}, Lng: ${formattedLng}`).openPopup();

      if (onLocationSelect) {
        onLocationSelect(formattedLat, formattedLng);
      }
    });

    // Marker Drag Listener
    marker.on('dragend', (e) => {
      const position = marker.getLatLng();
      const formattedLat = parseFloat(position.lat.toFixed(4));
      const formattedLng = parseFloat(position.lng.toFixed(4));

      marker.setPopupContent(`<b>📍 Selected Field Location</b><br>Lat: ${formattedLat}, Lng: ${formattedLng}`).openPopup();

      if (onLocationSelect) {
        onLocationSelect(formattedLat, formattedLng);
      }
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapType]);

  // Update map view when props change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const cur = markerRef.current.getLatLng();
      if (cur.lat !== latitude || cur.lng !== longitude) {
        mapInstanceRef.current.setView([latitude, longitude], 14);
        markerRef.current.setLatLng([latitude, longitude]);
        markerRef.current.setPopupContent(`<b>📍 Selected Field Location</b><br>Lat: ${latitude}, Lng: ${longitude}`);
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between bg-slate-800 text-white p-2.5 rounded-t-xl border-b border-slate-700">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <Icon name="globe" size={16} /> Real High-Resolution Satellite Map
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              mapType === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              mapType === 'street' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Street Map
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-80 rounded-b-xl overflow-hidden border-2 border-slate-700 shadow-md relative z-10"
      ></div>

      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
        💡 <strong>Tip for farmers:</strong> Drag map marker or click anywhere on green fields to select your farm plot location.
      </p>
    </div>
  );
};

export default MapPicker;
