import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

// SVG Gauge Chart Component for Impact Scores
const GaugeChart = ({ value, label, labelNe, strokeColor = "stroke-emerald-500", size = 110 }) => {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs transition hover:shadow-md">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="stroke-slate-100" strokeWidth={strokeWidth} fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-800">{normalizedValue}%</span>
        </div>
      </div>
      <span className="text-xs font-extrabold text-slate-700 mt-2 text-center uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-bold text-emerald-700 text-center">{labelNe}</span>
    </div>
  );
};

export const SustainabilityScore = () => {
  // Wizard Steps: 1: Metadata, 2: Crops, 3: Soil & Fertilizer, 4: Irrigation & Energy, 5: Tillage & Forestry, 6: Livestock (if mixed/livestock), 7: Evidence, 8: Review, 9: Results
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Farm Metadata
    farmName: 'Koshi Krishi Farm',
    farmArea: '2.5',
    areaUnit: 'ha', // 'ha' | 'bigha' | 'ropani'
    location: 'Sunsari, Koshi Province',
    farmType: 'mixed', // 'crop' | 'mixed' | 'livestock' | 'agroforestry'

    // Step 2: Crops List
    crops: [
      { id: 1, name: 'Basmati Rice (धान)', area: '1.5', yield: '4500' },
      { id: 2, name: 'Maize (मकै)', area: '1.0', yield: '3200' },
    ],

    // Step 3: Soil & Fertilizer
    compostKg: '1500',
    chemicalKg: '100',
    biocharKg: '250',
    coverCrop: 'yes', // 'yes' | 'no' | 'seasonal'

    // Step 4: Irrigation & Energy
    irrigation: 'solar', // 'rainfed' | 'drip' | 'solar' | 'grid' | 'diesel'
    dieselLiters: '20',
    electricityKwh: '50',

    // Step 5: Tillage & Residue & Trees
    tillage: 'zero', // 'zero' | 'reduced' | 'conventional'
    residue: 'incorporate', // 'incorporate' | 'mulch' | 'feed' | 'burn'
    treesCount: '45',
    treeType: 'Fruit & Fodder (फलफूल तथा घाँस)',

    // Step 6: Livestock (for mixed or livestock farm type)
    livestock: [
      { id: 1, type: 'Cattle / Buffalo (गाई/भैंसी)', count: '4' },
      { id: 2, type: 'Goats (बाख्रा)', count: '8' },
    ],
    manureMgmt: 'biogas', // 'biogas' | 'compost' | 'dried' | 'discharge'

    // Step 7: Evidence Files
    soilReportFile: null,
    farmPhotoFile: null,
  });

  // Results State
  const [results, setResults] = useState(null);

  // Handlers for dynamic lists
  const addCrop = () => {
    setFormData((prev) => ({
      ...prev,
      crops: [...prev.crops, { id: Date.now(), name: 'Wheat (गहुँ)', area: '0.5', yield: '1500' }],
    }));
  };

  const removeCrop = (id) => {
    setFormData((prev) => ({
      ...prev,
      crops: prev.crops.filter((c) => c.id !== id),
    }));
  };

  const updateCrop = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      crops: prev.crops.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  const addAnimal = () => {
    setFormData((prev) => ({
      ...prev,
      livestock: [...prev.livestock, { id: Date.now(), type: 'Poultry (कुखुरा)', count: '25' }],
    }));
  };

  const removeAnimal = (id) => {
    setFormData((prev) => ({
      ...prev,
      livestock: prev.livestock.filter((a) => a.id !== id),
    }));
  };

  const updateAnimal = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      livestock: prev.livestock.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }));
  };

  // Convert unit to Hectares for calculations
  const getAreaHectares = () => {
    const val = parseFloat(formData.farmArea) || 1;
    if (formData.areaUnit === 'bigha') return val * 0.677;
    if (formData.areaUnit === 'ropani') return val * 0.0509;
    return val;
  };

  // Separate Calculation Logic
  const calculateScoresAndCarbon = () => {
    const ha = Math.max(getAreaHectares(), 0.5);

    // 1. SUSTAINABILITY SUB-SCORES (0-100)
    let soil = 60;
    let water = 60;
    let fertilizer = 60;
    let biodiversity = 60;

    // Tillage
    if (formData.tillage === 'zero') soil += 25;
    else if (formData.tillage === 'reduced') soil += 15;
    else soil -= 10;

    // Residue
    if (formData.residue === 'incorporate') soil += 12;
    else if (formData.residue === 'mulch') soil += 15;
    else if (formData.residue === 'burn') soil -= 25;

    // Organic compost vs Chemical
    const compostKg = parseFloat(formData.compostKg) || 0;
    const chemicalKg = parseFloat(formData.chemicalKg) || 0;
    const biocharKg = parseFloat(formData.biocharKg) || 0;

    if (compostKg > 0) soil += Math.min(15, compostKg / (ha * 100));
    if (biocharKg > 0) soil += Math.min(10, biocharKg / (ha * 50));

    if (chemicalKg === 0) fertilizer = 95;
    else if (chemicalKg / ha < 100) fertilizer = 80;
    else if (chemicalKg / ha < 250) fertilizer = 60;
    else fertilizer = 40;

    // Cover crop
    if (formData.coverCrop === 'yes') { soil += 10; biodiversity += 10; }
    else if (formData.coverCrop === 'seasonal') { soil += 5; biodiversity += 5; }

    // Irrigation
    if (formData.irrigation === 'drip') water = 95;
    else if (formData.irrigation === 'solar') water = 90;
    else if (formData.irrigation === 'rainfed') water = 82;
    else if (formData.irrigation === 'grid') water = 70;
    else water = 45;

    // Trees
    const trees = parseInt(formData.treesCount) || 0;
    if (trees > 50) biodiversity += 25;
    else if (trees > 15) biodiversity += 15;
    else if (trees > 0) biodiversity += 8;

    // Crops diversity
    if (formData.crops.length >= 3) biodiversity += 15;
    else if (formData.crops.length >= 2) biodiversity += 8;

    const finalSoil = Math.min(100, Math.max(15, soil));
    const finalWater = Math.min(100, Math.max(15, water));
    const finalFertilizer = Math.min(100, Math.max(15, fertilizer));
    const finalBiodiversity = Math.min(100, Math.max(15, biodiversity));

    const overallScore = Math.round(
      finalSoil * 0.3 + finalWater * 0.25 + finalFertilizer * 0.25 + finalBiodiversity * 0.2
    );

    // 2. INDEPENDENT CARBON BENEFIT ESTIMATE (tCO₂e / year)
    // NEVER derived directly from sustainability score!
    let carbonTons = 0;

    // Tillage sequestration (~1.2 tCO2e/ha/yr for zero till, ~0.6 for reduced till)
    if (formData.tillage === 'zero') carbonTons += ha * 1.2;
    else if (formData.tillage === 'reduced') carbonTons += ha * 0.6;

    // Biochar Sequestration (~2.5 kg CO2e / kg biochar)
    carbonTons += biocharKg * 0.0025;

    // Compost (~0.3 kg CO2e / kg compost)
    carbonTons += compostKg * 0.0003;

    // Tree Sequestration (~0.022 tCO2e per tree / year)
    carbonTons += trees * 0.022;

    // Fuel Avoidance (Solar vs Diesel)
    if (formData.irrigation === 'solar') {
      const dieselSaved = parseFloat(formData.dieselLiters) || 30;
      carbonTons += dieselSaved * 12 * 0.00268;
    }

    // Methane reduction from Biogas digester
    if ((formData.farmType === 'mixed' || formData.farmType === 'livestock') && formData.manureMgmt === 'biogas') {
      const totalAnimals = formData.livestock.reduce((s, a) => s + (parseInt(a.count) || 0), 0);
      carbonTons += totalAnimals * 0.35;
    }

    const estimatedCarbonBenefit = Math.max(0.1, Math.round(carbonTons * 100) / 100);

    // Action recommendations
    const recs = [];
    if (formData.tillage !== 'zero') {
      recs.push({
        title: 'Transition to Zero or Reduced Tillage (शून्य जोताई अपनाउनुहोस्)',
        text: 'Practicing zero-tillage builds soil organic carbon and prevents erosion.',
        badge: 'High Impact',
        color: 'teal',
      });
    }
    if (chemicalKg > 100) {
      recs.push({
        title: 'Reduce Synthetic Urea & Increase Biochar (रासायनिक मल घटाउनुहोस्)',
        text: 'Replace 30% of chemical fertilizer with vermicompost and biochar to lower soil acidity.',
        badge: 'Soil Health',
        color: 'amber',
      });
    }
    if (formData.irrigation === 'diesel') {
      recs.push({
        title: 'Apply for Solar Pump Subsidy (सौर्य सिँचाइ अनुदान)',
        text: 'Switching from diesel to solar pumps reduces operational fuel costs to zero.',
        badge: 'Energy Savings',
        color: 'emerald',
      });
    }
    if (recs.length === 0) {
      recs.push({
        title: 'Maintain Regenerative Agriculture Practices (दीगो खेती जारी राख्नुहोस्)',
        text: 'Your field management scores high across soil, water, and biodiversity indices.',
        badge: 'Optimal',
        color: 'emerald',
      });
    }

    setResults({
      overallScore,
      soilScore: finalSoil,
      waterScore: finalWater,
      fertilizerScore: finalFertilizer,
      biodiversityScore: finalBiodiversity,
      estimatedCarbonBenefit,
      recommendations: recs,
    });

    try {
      localStorage.setItem('ecotrace_carbon_estimate', JSON.stringify({
        farmName: formData.farmName,
        location: formData.location,
        farmArea: formData.farmArea,
        areaUnit: formData.areaUnit,
        estimatedCarbonBenefit,
        calculatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        cropsCount: formData.crops.length,
        treesCount: formData.treesCount,
        tillage: formData.tillage,
        irrigation: formData.irrigation,
      }));
    } catch (err) {
      console.error(err);
    }

    setCurrentStep(9);
  };

  const isLivestockRelevant = formData.farmType === 'mixed' || formData.farmType === 'livestock';
  const totalSteps = isLivestockRelevant ? 8 : 7;

  const goToNextStep = () => {
    if (currentStep === 5 && !isLivestockRelevant) {
      setCurrentStep(7);
    } else if (currentStep === 8) {
      calculateScoresAndCarbon();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 7 && !isLivestockRelevant) {
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ── Page Header ── */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eco-badge eco-badge-success mb-2">🌿 Practical Assessment / व्यावहारिक मूल्यांकन</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Sustainability & Carbon Estimator
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Calculate your farm's <strong className="text-slate-700">Sustainability Score (0-100)</strong> and <strong className="text-emerald-700">Estimated Carbon Benefit (tCO₂e)</strong> in simple steps.
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">
            आफ्नो फारमको दिगोपन स्कोर र सम्भावित कार्बन लाभ सजिलै मापन गर्नुहोस्।
          </p>
        </div>
        {currentStep === 9 && (
          <div className="px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right shrink-0">
            <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Overall Rating</div>
            <div className="text-2xl font-black text-emerald-800">{results?.overallScore}/100</div>
          </div>
        )}
      </div>

      {/* ── Step Progress Indicator (Steps 1 to 8) ── */}
      {currentStep < 9 && (
        <div className="eco-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span>Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Farm Profile / फारम विवरण' :
              currentStep === 2 ? 'Crops & Yield / बाली तथा उत्पादन' :
              currentStep === 3 ? 'Soil & Fertilizer / माटो तथा मल' :
              currentStep === 4 ? 'Irrigation & Fuel / सिँचाइ तथा ऊर्जा' :
              currentStep === 5 ? 'Tillage & Trees / जोताई र रुखहरू' :
              currentStep === 6 ? 'Livestock & Manure / पशुपालन र गोबर' :
              currentStep === 7 ? 'Evidence Upload / प्रमाण पत्र' :
              'Review & Submit / अन्तिम समीक्षा'
            }</span>
            <span className="text-emerald-700">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── STEP 1: Farm Metadata ── */}
      {currentStep === 1 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800">1. Farm Profile & Location</h2>
            <p className="text-xs text-slate-500">फारमको नाम, क्षेत्रफल र स्थान / Basic farm information</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farm Name / फारमको नाम</label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / स्थान (District/Palika)</label>
              <input
                type="text"
                placeholder="e.g. Sunsari, Koshi Province"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Farm Area / जम्मा क्षेत्रफल</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.farmArea}
                  onChange={(e) => setFormData({ ...formData, farmArea: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
                />
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  className="px-3 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="ha">Hectares (हेक्टर)</option>
                  <option value="bigha">Bigha (बिघा)</option>
                  <option value="ropani">Ropani (रोपनी)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Farm Type / फारमको प्रकार</label>
              <select
                value={formData.farmType}
                onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
              >
                <option value="crop">Crop Farming Only (बाली खेती मात्र)</option>
                <option value="mixed">Mixed Crop & Livestock (मिश्रित खेती र पशुपालन)</option>
                <option value="livestock">Livestock & Dairy Farming (पशुपालन तथा दुग्ध)</option>
                <option value="agroforestry">Agroforestry & Orchards (कृषि वन तथा फलफूल)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-1.5"
            >
              Next Step: Crops →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Crops List ── */}
      {currentStep === 2 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">2. Crops & Harvest Yield</h2>
              <p className="text-xs text-slate-500">बालीको नाम, क्षेत्र र अनुमानित उत्पादन / Add all active seasonal crops</p>
            </div>
            <button
              onClick={addCrop}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition inline-flex items-center gap-1"
            >
              <Icon name="plus" size={14} /> Add Crop / + बाली थप्नुहोस्
            </button>
          </div>

          <div className="space-y-3">
            {formData.crops.map((crop, idx) => (
              <div key={crop.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Crop Name / बाली</label>
                    <input
                      type="text"
                      value={crop.name}
                      onChange={(e) => updateCrop(crop.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Area ({formData.areaUnit}) / क्षेत्रफल</label>
                    <input
                      type="number"
                      step="0.1"
                      value={crop.area}
                      onChange={(e) => updateCrop(crop.id, 'area', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Estimated Yield (kg) / उत्पादन</label>
                    <input
                      type="number"
                      value={crop.yield}
                      onChange={(e) => updateCrop(crop.id, 'yield', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-bold"
                    />
                  </div>
                </div>
                {formData.crops.length > 1 && (
                  <button
                    onClick={() => removeCrop(crop.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-xs shrink-0 self-end sm:self-center"
                  >
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              Next Step: Fertilizers →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Soil Nutrition & Fertilizers ── */}
      {currentStep === 3 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800">3. Soil Nutrition & Fertilizer Management</h2>
            <p className="text-xs text-slate-500">कम्पोस्ट, बायोचार र रासायनिक मलको प्रयोग / Organic & synthetic nutrient quantities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Organic Compost / Vermicompost (kg/year)
              </label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={formData.compostKg}
                onChange={(e) => setFormData({ ...formData, compostKg: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">गोबर वा भर्मिकम्पोस्ट प्रयोग परिमाण</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Biochar Application (kg/year)
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={formData.biocharKg}
                onChange={(e) => setFormData({ ...formData, biocharKg: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">बायोचार वा प्राङ्गारिक कोइला परिमाण</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Chemical Urea / DAP Fertilizer (kg/year)
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={formData.chemicalKg}
                onChange={(e) => setFormData({ ...formData, chemicalKg: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">रासायनिक यूरिया वा डीएपी परिमाण</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Green Manuring / Cover Crops (हरियो मल)
              </label>
              <select
                value={formData.coverCrop}
                onChange={(e) => setFormData({ ...formData, coverCrop: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
              >
                <option value="yes">Yes, Year-round (वर्षैभरी हरियो मल/छापो)</option>
                <option value="seasonal">Seasonal Cover Cropping (मौसमी हरियो मल - ढैंचा)</option>
                <option value="no">No Cover Cropping (प्रयोग नगरिएको)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              Next Step: Irrigation →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Irrigation & Energy ── */}
      {currentStep === 4 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800">4. Irrigation Source & Energy Consumption</h2>
            <p className="text-xs text-slate-500">सिँचाइ प्रविधि र इन्धन/बिजुली खपत / Irrigation technology & energy audit</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Irrigation Method / सिँचाइ प्रणाली</label>
              <select
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
              >
                <option value="solar">Solar Submersible Pump (सौर्य सिँचाइ पम्प)</option>
                <option value="drip">Drip Micro-irrigation (थोपा सिँचाइ प्रणाली)</option>
                <option value="rainfed">Rainfed / Monsoon Water (आकाशे पानीमा आधारित)</option>
                <option value="grid">Grid Electric Pump (विद्युतीय पम्प)</option>
                <option value="diesel">Diesel Engine Pump (डिजेल पम्प)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Diesel Fuel Used (Liters / Month)
              </label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={formData.dieselLiters}
                onChange={(e) => setFormData({ ...formData, dieselLiters: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">मासिक डिजेल खपत (लीटर)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Electricity Usage (kWh / Month)
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.electricityKwh}
                onChange={(e) => setFormData({ ...formData, electricityKwh: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">मासिक बिजुली खपत (यूनिट)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              Next Step: Tillage & Trees →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Tillage, Residue & Agroforestry ── */}
      {currentStep === 5 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800">5. Tillage, Residue & Agroforestry Trees</h2>
            <p className="text-xs text-slate-500">माटो जोताई, ठूटो व्यवस्थापन र कृषि वन / Tillage intensity & tree sequestration</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tillage Practice / जोताई पद्धति</label>
              <select
                value={formData.tillage}
                onChange={(e) => setFormData({ ...formData, tillage: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
              >
                <option value="zero">Zero Tillage / Direct Seeding (शून्य जोताई / नजोती रोप्ने)</option>
                <option value="reduced">Reduced Tillage / Strip Tillage (न्यून जोताई)</option>
                <option value="conventional">Conventional Deep Ploughing (परम्परागत गहिरो जोताई)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop Residue Management / बाली अवशेष</label>
              <select
                value={formData.residue}
                onChange={(e) => setFormData({ ...formData, residue: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
              >
                <option value="incorporate">Incorporate in Soil (माटोमा जोतेर मिसाउने)</option>
                <option value="mulch">Surface Mulching (माटोमा छापो हाल्ने)</option>
                <option value="feed">Livestock Feed & Fodder (गाईवस्तुलाई खुवाउने)</option>
                <option value="burn">Field Burning (खेतमै डढाउने)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Number of Boundary / Field Trees</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={formData.treesCount}
                onChange={(e) => setFormData({ ...formData, treesCount: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">खेतको डिल वा जग्गामा रहेका रुखहरूको संख्या</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Tree Types / रुखको किसिम</label>
              <input
                type="text"
                placeholder="e.g. Apple, Ipil-Ipil, Bamboo"
                value={formData.treeType}
                onChange={(e) => setFormData({ ...formData, treeType: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              {isLivestockRelevant ? 'Next Step: Livestock →' : 'Next Step: Evidence →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 6: Livestock & Manure (Shown for Mixed or Livestock farms) ── */}
      {currentStep === 6 && isLivestockRelevant && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">6. Livestock Numbers & Manure Management</h2>
              <p className="text-xs text-slate-500">पशुधन संख्या र गोबर/मल व्यवस्थापन / Animals & bio-methane digesters</p>
            </div>
            <button
              onClick={addAnimal}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition inline-flex items-center gap-1"
            >
              <Icon name="plus" size={14} /> Add Animal / + पशु थप्नुहोस्
            </button>
          </div>

          <div className="space-y-3">
            {formData.livestock.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Animal Type / पशुको प्रकार</label>
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => updateAnimal(item.id, 'type', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Head Count / संख्या</label>
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => updateAnimal(item.id, 'count', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-bold"
                    />
                  </div>
                </div>
                {formData.livestock.length > 1 && (
                  <button
                    onClick={() => removeAnimal(item.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-xs shrink-0 self-end sm:self-center"
                  >
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Manure Management Method / गोबर व्यवस्थापन</label>
            <select
              value={formData.manureMgmt}
              onChange={(e) => setFormData({ ...formData, manureMgmt: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white font-medium"
            >
              <option value="biogas">Biogas Digester Energy (बायोग्यास प्लान्ट जडान)</option>
              <option value="compost">Composted into Vermicompost (कम्पोस्टिङ पिट)</option>
              <option value="dried">Sun-dried dung cakes (सुकाएर प्रयोग)</option>
              <option value="discharge">Direct stream discharge (सोझै निकास)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              Next Step: Evidence →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 7: Optional Soil Report & Photo Evidence ── */}
      {currentStep === 7 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800">7. Optional Evidence & Reports (प्रमाण पत्र)</h2>
            <p className="text-xs text-slate-500">माटो परीक्षण रिपोर्ट वा फारमको तस्बिर अपलोड गर्नुहोस् / Optional verification media</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/40 transition">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-xs font-bold text-slate-700">Soil Test Lab Report (माटो परीक्षण)</p>
              <p className="text-[11px] text-slate-400 mt-1">PDF or image of NARC / Krishi Gyan Kendra test</p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFormData({ ...formData, soilReportFile: e.target.files[0]?.name || null })}
                className="hidden"
                id="soil-upload"
              />
              <label
                htmlFor="soil-upload"
                className="mt-3 inline-block px-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:border-emerald-400"
              >
                {formData.soilReportFile ? `✓ ${formData.soilReportFile}` : 'Choose File'}
              </label>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/40 transition">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-xs font-bold text-slate-700">Farm Photo / Video (खेतको तस्बिर)</p>
              <p className="text-[11px] text-slate-400 mt-1">Photo of crops, drip lines, or trees</p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData({ ...formData, farmPhotoFile: e.target.files[0]?.name || null })}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="mt-3 inline-block px-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:border-emerald-400"
              >
                {formData.farmPhotoFile ? `✓ ${formData.farmPhotoFile}` : 'Choose File'}
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button onClick={goToNextStep} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
              Review Form Data →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 8: Final Review Step ── */}
      {currentStep === 8 && (
        <div className="eco-card space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <span className="eco-badge eco-badge-info mb-2">🔍 Final Review</span>
            <h2 className="text-lg font-extrabold text-slate-800">8. Review Collected Farm Data</h2>
            <p className="text-xs text-slate-500">सबै विवरणहरूको अन्तिम समीक्षा गर्नुहोस् / Verify your entries before computing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="font-extrabold uppercase text-[11px] text-emerald-800">1. Farm Profile</div>
              <p><strong className="text-slate-700">Name:</strong> {formData.farmName}</p>
              <p><strong className="text-slate-700">Location:</strong> {formData.location}</p>
              <p><strong className="text-slate-700">Area:</strong> {formData.farmArea} {formData.areaUnit.toUpperCase()}</p>
              <p><strong className="text-slate-700">Type:</strong> {formData.farmType}</p>
              <button onClick={() => setCurrentStep(1)} className="text-sky-600 font-bold text-[10px] hover:underline mt-1">Edit Step 1</button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="font-extrabold uppercase text-[11px] text-emerald-800">2. Active Crops ({formData.crops.length})</div>
              {formData.crops.map((c, idx) => (
                <p key={c.id}>#{idx + 1} {c.name} — {c.area} {formData.areaUnit} ({c.yield} kg)</p>
              ))}
              <button onClick={() => setCurrentStep(2)} className="text-sky-600 font-bold text-[10px] hover:underline mt-1">Edit Step 2</button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="font-extrabold uppercase text-[11px] text-emerald-800">3. Soil & Fertilizers</div>
              <p><strong className="text-slate-700">Organic Compost:</strong> {formData.compostKg} kg/yr</p>
              <p><strong className="text-slate-700">Biochar:</strong> {formData.biocharKg} kg/yr</p>
              <p><strong className="text-slate-700">Chemical Fertilizer:</strong> {formData.chemicalKg} kg/yr</p>
              <p><strong className="text-slate-700">Cover Crop:</strong> {formData.coverCrop}</p>
              <button onClick={() => setCurrentStep(3)} className="text-sky-600 font-bold text-[10px] hover:underline mt-1">Edit Step 3</button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="font-extrabold uppercase text-[11px] text-emerald-800">4. Irrigation & Energy</div>
              <p><strong className="text-slate-700">Irrigation:</strong> {formData.irrigation}</p>
              <p><strong className="text-slate-700">Diesel:</strong> {formData.dieselLiters} L/month</p>
              <p><strong className="text-slate-700">Electricity:</strong> {formData.electricityKwh} kWh/month</p>
              <button onClick={() => setCurrentStep(4)} className="text-sky-600 font-bold text-[10px] hover:underline mt-1">Edit Step 4</button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 sm:col-span-2">
              <div className="font-extrabold uppercase text-[11px] text-emerald-800">5. Tillage & Trees</div>
              <p><strong className="text-slate-700">Tillage:</strong> {formData.tillage} | <strong className="text-slate-700">Residue:</strong> {formData.residue} | <strong className="text-slate-700">Trees:</strong> {formData.treesCount} ({formData.treeType})</p>
              <button onClick={() => setCurrentStep(5)} className="text-sky-600 font-bold text-[10px] hover:underline mt-1">Edit Step 5</button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button onClick={goToPrevStep} className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100">
              ← Back
            </button>
            <button
              onClick={calculateScoresAndCarbon}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl transition shadow-md inline-flex items-center gap-2"
            >
              🚀 Calculate Sustainability & Carbon Benefits
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 9: RESULTS DASHBOARD ── */}
      {currentStep === 9 && results && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sustainability Score */}
            <div className="p-6 bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">Index Score</span>
                <h2 className="text-xl font-extrabold mt-1">Sustainability Score</h2>
                <p className="text-xs text-emerald-100 mt-1 font-medium">दीगोपन सूचकांक (0-100)</p>
                <p className="text-[11px] text-emerald-200 mt-2">Evaluates soil health, water efficiency & biodiversity.</p>
              </div>
              <div className="text-center px-4 py-3 bg-white/15 border border-white/20 rounded-2xl shrink-0">
                <span className="text-4xl font-black">{results.overallScore}</span>
                <span className="text-xs text-emerald-200 block font-bold">/ 100</span>
              </div>
            </div>

            {/* Estimated Carbon Benefit */}
            <div className="p-6 bg-gradient-to-br from-sky-800 via-blue-800 to-indigo-900 text-white rounded-3xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200">Carbon Estimate</span>
                <h2 className="text-xl font-extrabold mt-1">Estimated Carbon Benefit</h2>
                <p className="text-xs text-sky-100 mt-1 font-medium">अनुमानित कार्बन लाभ (tCO₂e / year)</p>
                <p className="text-[11px] text-sky-200 mt-2">Calculated from tillage, biochar, trees & energy reduction.</p>
              </div>
              <div className="text-center px-4 py-3 bg-white/15 border border-white/20 rounded-2xl shrink-0">
                <span className="text-3xl font-black">{results.estimatedCarbonBenefit}</span>
                <span className="text-xs text-sky-200 block font-bold">tCO₂e / yr</span>
              </div>
            </div>
          </div>

          {/* Critical Disclaimer */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <span className="text-base shrink-0">ℹ️</span>
            <div>
              <span className="font-bold">Important Notice:</span> Carbon values represent estimated annual sequestration/offsets and are NOT certified tradable carbon credits. Official registry verification is required before trading on carbon marketplaces.{' '}
              <span className="text-amber-800 font-medium">नोट: यहाँ देखाइएको कार्बन मान अनुमानित लाभ हो, प्रमाणित कार्बन क्रेडिट होइन।</span>
            </div>
          </div>

          {/* Sub-Score Gauges Grid */}
          <div className="eco-card space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Category Impact Scores / विधागत सूचकांकहरू
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GaugeChart value={results.soilScore} label="Soil Health" labelNe="माटोको स्वास्थ्य" strokeColor="stroke-emerald-500" />
              <GaugeChart value={results.waterScore} label="Water Efficiency" labelNe="सिँचाइ क्षमता" strokeColor="stroke-cyan-500" />
              <GaugeChart value={results.fertilizerScore} label="Nutrient Balance" labelNe="मल सन्तुलन" strokeColor="stroke-amber-500" />
              <GaugeChart value={results.biodiversityScore} label="Biodiversity" labelNe="जैविक विविधता" strokeColor="stroke-teal-500" />
            </div>
          </div>

          {/* Recommendations & Action Plan */}
          <div className="eco-card space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>💡</span> Recommended Action Plan / सिफारिस गरिएका सुधारहरू
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rec.title}</span>
                    <span className="eco-badge eco-badge-success text-[9px]">{rec.badge}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition"
            >
              🔄 Recalculate / नयाँ मूल्यांकन गर्नुहोस्
            </button>
            <Link
              to="/carbon"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
            >
              💰 View Carbon Earnings & Send to Govt / कार्बन आम्दानी हेर्नुहोस्
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScore;
