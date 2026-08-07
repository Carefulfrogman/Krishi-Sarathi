import React, { useState } from 'react';
import Icon from './Icons';

export const QRScanner = ({ onScanResult }) => {
  const [inputCode, setInputCode] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSimulatedScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const sampleCode = 'BATCH-2026-BC89';
      setInputCode(sampleCode);
      if (onScanResult) onScanResult(sampleCode);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim() && onScanResult) {
      onScanResult(inputCode.trim());
    }
  };

  return (
    <div className="eco-card bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Icon name="qrCode" size={20} className="text-emerald-600" />
          Produce Batch QR Scanner
        </h3>
        <span className="eco-badge eco-badge-info">Provenance Verifier</span>
      </div>

      {/* Camera Preview Simulator */}
      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-700">
        {scanning ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-emerald-400 font-semibold">Scanning QR provenance barcode...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <Icon name="camera" size={24} />
            </div>
            <p className="text-xs text-slate-300 font-medium">Position produce batch QR code within view frame</p>
            <button
              onClick={handleSimulatedScan}
              className="mt-2 px-4 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-500 transition shadow-sm"
            >
              Simulate Camera Scan
            </button>
          </div>
        )}

        {/* Framing brackets overlay */}
        <div className="absolute inset-8 border-2 border-emerald-500/40 rounded-lg pointer-events-none"></div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Or type batch code e.g. BATCH-2026-BC89"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default QRScanner;
