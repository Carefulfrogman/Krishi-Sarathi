import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';

/* ═══════════════════════════════════════════════════════════
   MULTI-STEP FARMER PRODUCT LISTING WIZARD
   ═══════════════════════════════════════════════════════════ */

const categories = [
  { value: 'grain', label: '🌾 Grains & Cereals' },
  { value: 'fruit', label: '🍎 Fruits & Orchards' },
  { value: 'spice', label: '🌶️ Spices & Herbs' },
  { value: 'beverage', label: '☕ Tea, Coffee & Beverages' },
  { value: 'oil', label: '🫒 Oils & Extracts' },
  { value: 'specialty', label: '🍯 Specialty & Honey' },
  { value: 'vegetable', label: '🥬 Vegetables' },
];

const provinces = [
  'Province 1 (Koshi)',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

export const ListProduct = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Basic Info
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('grain');
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');

  // 2. Pricing & Qty
  const [priceNPR, setPriceNPR] = useState('');
  const [unit, setUnit] = useState('kg');
  const [availableQty, setAvailableQty] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('1');

  // 3. Location
  const [province, setProvince] = useState(provinces[2]);
  const [district, setDistrict] = useState('Chitwan');
  const [municipality, setMunicipality] = useState('Bharatpur-10');
  const [farmAddress, setFarmAddress] = useState('Green Horizon Organic Plot 4');

  // 4. Product Images
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const fileInputRef = useRef(null);

  // 5. Sustainability Info
  const [organic, setOrganic] = useState(true);
  const [waterUsage, setWaterUsage] = useState('Rainfed + Solar Drip');
  const [fertilizerUsage, setFertilizerUsage] = useState('100% Vermicompost');
  const [carbonFootprint, setCarbonFootprint] = useState('-1.4 kg CO2e / kg');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);

  const calculatedScore = organic ? 94 : 82;

  // 6. Shipping
  const [deliveryType, setDeliveryType] = useState('Standard Courier & Farm Pickup');

  // Submission State
  const [submitted, setSubmitted] = useState(false);
  const [listingId, setListingId] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => [...prev, { name: file.name, url: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    const finalName = productName.trim() || 'Organic Farm Produce';
    const finalPrice = priceNPR || '180';
    setProductName(finalName);
    setPriceNPR(finalPrice);

    const id = 'ECO-LIST-' + Math.floor(100000 + Math.random() * 900000);
    setListingId(id);
    setSubmitted(true);
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Pricing & Qty' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Images' },
    { num: 5, label: 'Sustainability' },
    { num: 6, label: 'Shipping' },
  ];

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-8">
        <div className="p-8 bg-white border border-emerald-200 rounded-2xl text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold border border-emerald-200">
            ✓
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Product Successfully Listed!</h2>
          <p className="text-xs text-slate-500">Your item is now verified and active on the Krishi Saarathi Haat Bazaar marketplace.</p>
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-left">
            <div className="flex justify-between"><span className="text-slate-500">Listing ID</span><span className="font-bold text-slate-900">{listingId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Product Name</span><span className="font-bold text-slate-900">{productName || 'Organic Farm Produce'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-bold text-emerald-700">NPR {priceNPR || '180'} / {unit}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Sustainability Score</span><span className="font-bold text-emerald-700">{calculatedScore} / 100</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                setProductName('');
                setPriceNPR('');
                setImages([]);
              }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              + List Another Item
            </button>
            <button
              type="button"
              onClick={() => navigate('/farm-marketplace')}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
            >
              View Marketplace →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Wizard Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase rounded border border-emerald-200">
            Farmer Portal • Sell Produce
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Add Product to Marketplace</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {steps.map(s => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                currentStep === s.num
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 1: Basic Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Organic Pokhareli Jethoboodho Rice"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                placeholder="Aromatic, sun-dried, pesticide-free Basmati harvested from Chitwan."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={detailedDesc}
                onChange={e => setDetailedDesc(e.target.value)}
                placeholder="Provide details about soil cultivation, natural fertilizer application, storage conditions, and cooking qualities..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: PRICING & QTY */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 2: Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (NPR)</label>
                <input
                  type="number"
                  value={priceNPR}
                  onChange={e => setPriceNPR(e.target.value)}
                  placeholder="180"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measurement</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="kg">Per kg</option>
                  <option value="quintal">Per Quintal</option>
                  <option value="litre">Per Litre</option>
                  <option value="box">Per Box</option>
                  <option value="unit">Per Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Quantity</label>
                <input
                  type="number"
                  value={availableQty}
                  onChange={e => setAvailableQty(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
              <input
                type="number"
                value={minOrderQty}
                onChange={e => setMinOrderQty(e.target.value)}
                placeholder="5"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 3: Farm Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Province</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Chitwan"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Municipality / Rural Municipality</label>
                <input
                  type="text"
                  value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  placeholder="Bharatpur Metropolitan City-10"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farm Specific Address</label>
                <input
                  type="text"
                  value={farmAddress}
                  onChange={e => setFarmAddress(e.target.value)}
                  placeholder="Green Horizon Eco Plot #4, Dipendra Chowk"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRODUCT IMAGES */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 4: Product Images</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition"
            >
              <Icon name="camera" size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">Click or drag images here to upload</p>
              <p className="text-[10px] text-slate-400 mt-1">Upload photos showing harvest quality, packaging, and field conditions.</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className={`relative rounded-xl overflow-hidden border p-1 ${coverIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200'}`}>
                    <img src={img.url} alt="Uploaded" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className={`mt-1 w-full py-0.5 text-[9px] font-bold rounded ${coverIndex === idx ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {coverIndex === idx ? 'Cover Image' : 'Set as Cover'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: SUSTAINABILITY METRICS */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 5: Sustainability Parameters</h2>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900">Auto-Generated Sustainability Score</span>
                <p className="text-[10px] text-emerald-700">Derived from verified soil practices and organic management.</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                {calculatedScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organic Certification</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <input type="radio" checked={organic} onChange={() => setOrganic(true)} /> Certified Organic
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <input type="radio" checked={!organic} onChange={() => setOrganic(false)} /> Conventional
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={e => setHarvestDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Water Usage</label>
                <input
                  type="text"
                  value={waterUsage}
                  onChange={e => setWaterUsage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fertilizer Usage</label>
                <input
                  type="text"
                  value={fertilizerUsage}
                  onChange={e => setFertilizerUsage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Carbon Footprint Impact</label>
                <input
                  type="text"
                  value={carbonFootprint}
                  onChange={e => setCarbonFootprint(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SHIPPING */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Step 6: Shipping & Logistics</h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fulfillment / Delivery Method</label>
              <select
                value={deliveryType}
                onChange={e => setDeliveryType(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Standard Courier & Farm Pickup">Standard Delivery & Local Farm Pickup</option>
                <option value="Cold Storage Freight">Temperature-Controlled Freight</option>
                <option value="Direct Buyer Logistics">Buyer Organized Transport</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-slate-900 block">Final Review Summary</span>
              <div className="flex justify-between text-slate-600"><span>Product:</span> <strong className="text-slate-900">{productName || 'Organic Farm Produce'}</strong></div>
              <div className="flex justify-between text-slate-600"><span>Price:</span> <strong className="text-slate-900">NPR {priceNPR || '180'} / {unit}</strong></div>
              <div className="flex justify-between text-slate-600"><span>Location:</span> <strong className="text-slate-900">{district}, {province}</strong></div>
              <div className="flex justify-between text-slate-600"><span>Certification:</span> <strong className="text-emerald-700">{organic ? 'Certified Organic' : 'Conventional'}</strong></div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              ← Previous Step
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
            >
              Publish Product to Marketplace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
