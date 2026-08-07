import React, { useState, useEffect } from 'react';
import Icon from '../components/Icons';

// Sub-component for SVG Gauge Chart
const GaugeChart = ({ value, label, color = "text-emerald-500", strokeColor = "stroke-emerald-500", size = 110 }) => {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Limit value to range 0-100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100/80 shadow-sm transition hover:shadow-md">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
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
      <span className="text-xs font-bold text-slate-500 mt-2 text-center uppercase tracking-wider">{label}</span>
    </div>
  );
};

export const SustainabilityScore = () => {
  // Page Flow Stages: 'upload' | 'analyzing' | 'questions' | 'results'
  const [stage, setStage] = useState('upload');
  
  // Media State
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('video'); // 'image' | 'video'
  const [isDragOver, setIsDragOver] = useState(false);

  // AI Scan simulation details
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMetric, setScanMetric] = useState('');
  const [detectedMetrics, setDetectedMetrics] = useState({
    vegetation: null,
    cropHealth: null,
    bareSoil: null,
    trees: null,
    irrigation: null
  });

  // Questions State
  const [answers, setAnswers] = useState({
    // Essential questions (used if media uploaded)
    cropType: 'Basmati Rice',
    fertilizerSource: 'fully-organic',

    // Comprehensive questions (used if no media uploaded)
    vegVariety: 'polyculture',
    pestStrategy: 'ipm',
    soilTillage: 'cover-zero',
    agroforestry: 'extensive',
    irrigationSource: 'solar-drip',
    chemicalFertilizer: 'organic-only'
  });

  // Generated results
  const [scores, setScores] = useState({
    trustScore: 0,
    soilScore: 0,
    waterScore: 0,
    fertilizerScore: 0,
    carbonScore: 0,
    confidenceScore: 0
  });
  const [recommendations, setRecommendations] = useState([]);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragOver(true);
    } else if (e.type === "dragleave") {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMediaFile(file);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  // Start AI Analysis Process
  const startAnalysis = () => {
    if (!mediaFile) return;
    setStage('analyzing');
    setScanProgress(0);
  };

  // Skip Media to Manual Flow
  const skipToManual = () => {
    setMediaFile(null);
    setStage('questions');
  };

  // Simulate AI Scan
  useEffect(() => {
    if (stage !== 'analyzing') return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          // Set detected variables to high grades
          setDetectedMetrics({
            vegetation: 'High Density Polyculture (Dense Canopy)',
            cropHealth: 'Excellent NDVI index (0.82)',
            bareSoil: 'Low Exposure (< 15%) with crop cover',
            trees: '24 trees detected / ha',
            irrigation: 'Drip lines & solar-pumping detected'
          });
          setTimeout(() => {
            setStage('questions');
          }, 800);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [stage]);

  // Set message based on progress
  useEffect(() => {
    if (scanProgress < 20) {
      setScanMetric('Detecting canopy vegetation patterns...');
    } else if (scanProgress < 40) {
      setScanMetric('Analyzing crop health indices (NDVI mapping)...');
    } else if (scanProgress < 60) {
      setScanMetric('Scanning bare soil percentages...');
    } else if (scanProgress < 80) {
      setScanMetric('Counting agroforestry trees & tree lines...');
    } else {
      setScanMetric('Verifying irrigation channels & solar pump rigs...');
    }
  }, [scanProgress]);

  // Compute final scores
  const calculateFinalScores = () => {
    let soil = 70;
    let water = 70;
    let fertilizer = 70;
    let carbon = 70;
    let confidence = 75; // Standard self-reported confidence

    const recs = [];

    if (mediaFile) {
      // AI Verification gives starting high scores + 95% high confidence
      confidence = 95;
      soil = 88;
      water = 92;
      fertilizer = 85;
      carbon = 88;

      // Adjust based on the 2 essential questions
      if (answers.cropType === 'Basmati Rice') {
        water -= 5; // rice needs water management
        recs.push({
          id: 'e-1',
          title: 'AWD (Alternate Wetning and Drying) for Basmati',
          text: 'Since you grow Basmati Rice, implementing AWD can save up to 30% water and reduce methane emissions.',
          priority: 'High Priority',
          color: 'teal'
        });
      } else if (answers.cropType === 'Mixed Vegetables') {
        soil += 4;
        carbon += 3;
      }

      if (answers.fertilizerSource === 'fully-organic') {
        fertilizer = 98;
        soil += 6;
      } else if (answers.fertilizerSource === 'chemical-intensive') {
        fertilizer = 40;
        soil -= 15;
        recs.push({
          id: 'e-2',
          title: 'Transition to Bio-composting',
          text: 'Integrating vermicompost and legume cover crop rotations will build carbon stocks and reduce reliance on synthetic urea.',
          priority: 'Critical Priority',
          color: 'red'
        });
      } else {
        fertilizer = 70;
        soil += 2;
        recs.push({
          id: 'e-3',
          title: 'Increase Organic Ratio',
          text: 'Raise the percentage of organic amendments over chemical fertilizer to boost soil microbes.',
          priority: 'Medium Priority',
          color: 'emerald'
        });
      }
    } else {
      // Manual Questionnaire Calculations
      // 1. Veg & Polyculture
      if (answers.vegVariety === 'polyculture') {
        soil += 8;
        carbon += 10;
      } else {
        soil -= 10;
        recs.push({
          id: 'm-1',
          title: 'Diversify Monoculture Fields',
          text: 'Rotating main crops with mustard or lentils breaks pest cycles and naturally restores nitrogen.',
          priority: 'High Priority',
          color: 'teal'
        });
      }

      // 2. Pest Strategy
      if (answers.pestStrategy === 'ipm') {
        fertilizer += 10;
      } else {
        fertilizer -= 12;
        recs.push({
          id: 'm-2',
          title: 'Adopt Integrated Pest Management (IPM)',
          text: 'Use pheromone traps, yellow sticky cards, and encourage beneficial predator insects before applying chemical sprays.',
          priority: 'Medium Priority',
          color: 'emerald'
        });
      }

      // 3. Soil Tillage
      if (answers.soilTillage === 'cover-zero') {
        soil += 12;
        carbon += 10;
      } else {
        soil -= 8;
        carbon -= 6;
        recs.push({
          id: 'm-3',
          title: 'Practice Reduced Tillage & Cover Cropping',
          text: 'Frequent deep tilling exposes organic matter to oxygen, depleting carbon. Plant legume cover crops post-harvest.',
          priority: 'High Priority',
          color: 'teal'
        });
      }

      // 4. Agroforestry
      if (answers.agroforestry === 'extensive') {
        carbon += 12;
        soil += 5;
      } else {
        carbon -= 10;
        recs.push({
          id: 'm-4',
          title: 'Plant Perimeter Agroforestry Trees',
          text: 'Fringe boundary areas with native fodder or timber trees to increase carbon sequestration and form windbreaks.',
          priority: 'Medium Priority',
          color: 'emerald'
        });
      }

      // 5. Water Source
      if (answers.irrigationSource === 'solar-drip') {
        water = 96;
      } else if (answers.irrigationSource === 'rainwater') {
        water = 82;
      } else {
        water = 45;
        recs.push({
          id: 'm-5',
          title: 'Upgrade Flood Irrigation to Drip Kits',
          text: 'Flood irrigation causes heavy soil nutrient runoff and water waste. Drip lines improve water efficiency by up to 60%.',
          priority: 'Critical Priority',
          color: 'red'
        });
      }

      // 6. Fertilizer
      if (answers.chemicalFertilizer === 'organic-only') {
        fertilizer = 96;
        soil += 5;
      } else if (answers.chemicalFertilizer === 'mixed') {
        fertilizer = 72;
      } else {
        fertilizer = 35;
        soil -= 10;
        recs.push({
          id: 'm-6',
          title: 'Stop Intensive Chemical Fertilizer',
          text: 'Excessive chemical urea applications lead to soil acidification. Transition to locally made biochar & manure slurry.',
          priority: 'Critical Priority',
          color: 'red'
        });
      }
    }

    // Bound scores between 10 and 100
    const finalSoil = Math.min(Math.max(soil, 10), 100);
    const finalWater = Math.min(Math.max(water, 10), 100);
    const finalFertilizer = Math.min(Math.max(fertilizer, 10), 100);
    const finalCarbon = Math.min(Math.max(carbon, 10), 100);

    // Compute Overall Trust Score
    const overallScore = Math.round((finalSoil * 0.3) + (finalWater * 0.25) + (finalFertilizer * 0.25) + (finalCarbon * 0.2));

    if (recs.length === 0) {
      recs.push({
        id: 'rec-success',
        title: 'Maintain Stellar Green Practice standards',
        text: 'Your current operations meet high sustainability targets. Document these practices to claim carbon premium rates.',
        priority: 'Optimal Stand',
        color: 'emerald'
      });
    }

    setScores({
      trustScore: overallScore,
      soilScore: finalSoil,
      waterScore: finalWater,
      fertilizerScore: finalFertilizer,
      carbonScore: finalCarbon,
      confidenceScore: confidence
    });

    setRecommendations(recs);
    setStage('results');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Dhaka Style Border Header */}
      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-blue-700 to-emerald-600"></div>
        <div className="space-y-1 relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
            🌿 Sustainability Score Redesign
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Krishi Saarathi Smart Assessment</h1>
          <p className="text-sm text-slate-500 max-w-xl font-medium">
            Generate your certified Trust Score & Environmental Grades using media AI Analysis or manual operational self-reporting.
          </p>
        </div>
        {stage === 'results' && (
          <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left md:text-right shrink-0">
            <div className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">Trust Score Status</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {scores.trustScore >= 85 ? 'AAA ESG Tier' : scores.trustScore >= 70 ? 'AA Tier Premium' : 'A Class Standard'}
            </div>
          </div>
        )}
      </div>

      {/* STAGE 1: UPLOAD AND ENTRY GATE */}
      {stage === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Panel: Media AI Upload */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
                ⚡ Recommended Flow
              </span>
              <h2 className="text-2xl font-black text-white">Upload Farm Image or Video</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our computer vision models automatically detect vegetation cover, crop stress indices, bare soil boundaries, tree presence, and irrigation setups.
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition relative flex flex-col items-center justify-center space-y-3 min-h-[220px] ${
                isDragOver ? 'border-emerald-400 bg-slate-900' : 'border-slate-700 hover:border-emerald-500/80'
              }`}
            >
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-4xl">📤</div>
              <div className="text-xs font-bold text-slate-200">
                {mediaFile ? `Selected: ${mediaFile.name}` : 'Click or Drag Video or Photo here'}
              </div>
              <div className="text-[10px] text-slate-500">Supports MP4, MOV, JPG, PNG • Max 100MB</div>
              {mediaFile && (
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-md font-bold uppercase tracking-wider">
                  Ready to Scan ({mediaType})
                </div>
              )}
            </div>

            <button
              onClick={startAnalysis}
              disabled={!mediaFile}
              className={`w-full py-4 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                mediaFile
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>🔬</span> Analyze with AI Scanner
            </button>
          </div>

          {/* Right Panel: Skip to Self Report */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                Manual Pathway
              </span>
              <h2 className="text-2xl font-black text-slate-900">Skip and Self-Report</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Don't have farm media on hand? You can still manually complete the comprehensive survey about your irrigation source, tillage practice, cropping biodiversity, and fertiliser cycles to compute a Trust Score.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-emerald-600">✓</span> Full 6-part sustainability questionnaire
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-emerald-600">✓</span> Instant scorecard generator
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-emerald-600">✓</span> Standard confidence rating
              </div>
            </div>

            <button
              onClick={skipToManual}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl transition border border-slate-200 shadow-sm"
            >
              Continue to Questionnaire
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: AI ANALYZING SCREEN */}
      {stage === 'analyzing' && (
        <div className="max-w-xl mx-auto bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto"></div>
            <h3 className="text-lg font-black mt-4">AI Vision Scanner Active</h3>
            <p className="text-xs text-emerald-400 font-semibold">{scanMetric}</p>
          </div>

          {/* Core Detected Parameters list during live progress */}
          <div className="space-y-3 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Vegetation cover</span>
              <span className={scanProgress >= 20 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {scanProgress >= 20 ? '✓ Detected' : 'Pending...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Crop health (NDVI)</span>
              <span className={scanProgress >= 40 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {scanProgress >= 40 ? '✓ Calculated' : 'Pending...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Bare soil boundary</span>
              <span className={scanProgress >= 60 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {scanProgress >= 60 ? '✓ Evaluated' : 'Pending...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Tree & canopy counts</span>
              <span className={scanProgress >= 80 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {scanProgress >= 80 ? '✓ Counted' : 'Pending...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Irrigation infrastructure</span>
              <span className={scanProgress >= 100 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {scanProgress >= 100 ? '✓ Scanned' : 'Pending...'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Overall Scan Progress</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: QUESTIONNAIRE (CONDITIONAL) */}
      {stage === 'questions' && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📋</span> Follow-up Questionnaire
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              {mediaFile 
                ? 'AI scanner successfully parsed your media. Verify these remaining essential parameters.'
                : 'Complete the comprehensive list of operational parameters to self-report.'}
            </p>
          </div>

          {/* Conditional Questionnaire */}
          {mediaFile ? (
            /* Essential questionnaire (2 questions) */
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2 border border-emerald-100">
                <span>⚡</span> AI Scan verified vegetation, soil levels, trees, and irrigation. Only crop and nutrients remain.
              </div>

              {/* Crop type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Crop Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Basmati Rice', 'Mixed Vegetables', 'Orchards / Tea'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAnswers({ ...answers, cropType: c })}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        answers.cropType === c 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrients */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Nutrient & Fertiliser Strategy</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'fully-organic', label: '100% Organic Manure' },
                    { value: 'mixed', label: 'Integrated (Organic + Chemical)' },
                    { value: 'chemical-intensive', label: 'Intensive Synthetic Urea' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setAnswers({ ...answers, fertilizerSource: item.value })}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        answers.fertilizerSource === item.value 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Comprehensive questionnaire (6 questions) */
            <div className="space-y-6">
              {/* Q1: Vegetation Variety */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">1. Vegetation Diversity</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'polyculture', title: 'Polyculture & Crop Rotation', desc: 'Diversified planting cycles & multi-cropping' },
                    { val: 'monoculture', title: 'Monoculture Fields', desc: 'Repeated single-crop cycles only' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, vegVariety: item.val })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-center ${
                        answers.vegVariety === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Pest strategy */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">2. Crop Protection & Pest Strategy</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'ipm', title: 'Integrated Pest Management (IPM)', desc: 'Biological controls, sticky traps & minimal sprays' },
                    { val: 'chemical', title: 'Chemical-Intensive Protection', desc: 'Frequent preventative chemical pesticides' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, pestStrategy: item.val })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-center ${
                        answers.pestStrategy === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Bare Soil & Tillage */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">3. Bare Soil & Tillage Practices</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'cover-zero', title: 'Cover Cropping + Low Tillage', desc: 'Soil covered year-round, minimal ground turning' },
                    { val: 'heavy-tillage', title: 'Frequent Heavy Tillage', desc: 'Soil plowed multiple times, left bare post-harvest' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, soilTillage: item.val })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-center ${
                        answers.soilTillage === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Trees & Agroforestry */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">4. Presence of Trees & Buffer Zones</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'extensive', title: 'Active Boundary Agroforestry', desc: 'Frequent trees & foliage lines around fields' },
                    { val: 'none', title: 'Clear-Cut Fields', desc: 'No trees or windbreaks along crop boundaries' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, agroforestry: item.val })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-center ${
                        answers.agroforestry === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Water & Irrigation */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">5. Water & Irrigation Source</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'solar-drip', title: 'Solar Drip Systems' },
                    { val: 'rainwater', title: 'Rainwater Capture' },
                    { val: 'flood', title: 'Flood Canal Irrigation' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, irrigationSource: item.val })}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        answers.irrigationSource === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q6: Nutrients */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">6. Fertiliser & Soil Nutrition</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'organic-only', title: '100% Organic compost' },
                    { val: 'mixed', title: 'Organic / Chemical Mix' },
                    { val: 'chemical', title: 'Chemical Intensives' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, chemicalFertilizer: item.val })}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        answers.chemicalFertilizer === item.val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStage('upload')}
              className="px-4 py-2 hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl transition"
            >
              ← Back
            </button>
            <button
              onClick={calculateFinalScores}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-md"
            >
              Generate Sustainability Scorecard 🚀
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: RESULTS & DASHBOARD */}
      {stage === 'results' && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Trust Score & Confidence Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">
                  ESG Trust Score Report
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Sustainability Trust Score</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Weighted score assessing soil organic carbon retention, irrigation efficiency, synthetic nitrogen reliance, and local forest biodiversity.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-6 py-3 bg-emerald-505 text-slate-950 font-black text-4xl rounded-2xl shadow-lg border border-emerald-400 shrink-0">
                    <span className="text-slate-950">{scores.trustScore}</span>
                    <span className="text-sm opacity-80 mt-2 text-slate-900">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Confidence score */}
              <div className="relative z-10 border-t border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    🎯 Confidence Rating: <span className="text-emerald-400 font-black">{scores.confidenceScore}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {mediaFile 
                      ? 'High confidence score verified via computer vision analysis on uploaded media.'
                      : 'Standard confidence rating based on self-reported operational practices.'}
                  </p>
                </div>
                {mediaFile && (
                  <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-xl font-bold flex items-center gap-1.5 border border-emerald-500/20">
                    <span>✓</span> Media Verified Scan
                  </div>
                )}
              </div>
            </div>

            {/* Recalculate options */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>🔄</span> Adjust & Recalculate
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Have you recently installed drip irrigation, planted native trees, or transitioned to organic inputs? Update your answers to generate a fresh scorecard.
                </p>
              </div>

              {/* Mini update interface */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Water System</label>
                  <select
                    value={mediaFile ? answers.cropType : answers.irrigationSource}
                    onChange={(e) => {
                      if (mediaFile) {
                        setAnswers({ ...answers, cropType: e.target.value });
                      } else {
                        setAnswers({ ...answers, irrigationSource: e.target.value });
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {mediaFile ? (
                      <>
                        <option value="Basmati Rice">Basmati Rice</option>
                        <option value="Mixed Vegetables">Mixed Vegetables</option>
                        <option value="Orchards / Tea">Orchards / Tea</option>
                      </>
                    ) : (
                      <>
                        <option value="solar-drip">Solar Drip Systems</option>
                        <option value="rainwater">Rainwater Capture</option>
                        <option value="flood">Flood Canal Irrigation</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fertiliser System</label>
                  <select
                    value={mediaFile ? answers.fertilizerSource : answers.chemicalFertilizer}
                    onChange={(e) => {
                      if (mediaFile) {
                        setAnswers({ ...answers, fertilizerSource: e.target.value });
                      } else {
                        setAnswers({ ...answers, chemicalFertilizer: e.target.value });
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {mediaFile ? (
                      <>
                        <option value="fully-organic">100% Organic Manure</option>
                        <option value="mixed">Integrated Mix</option>
                        <option value="chemical-intensive">Intensive Synthetic</option>
                      </>
                    ) : (
                      <>
                        <option value="organic-only">100% Organic compost</option>
                        <option value="mixed">Organic / Chemical Mix</option>
                        <option value="chemical">Chemical Intensives</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button
                onClick={calculateFinalScores}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>🔄</span> Recalculate Score
              </button>
            </div>
          </div>

          {/* Premium Gauge Charts Grid */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Impact Scores Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GaugeChart value={scores.soilScore} label="Soil Health" strokeColor="stroke-emerald-500" />
              <GaugeChart value={scores.waterScore} label="Water Efficiency" strokeColor="stroke-cyan-500" />
              <GaugeChart value={scores.fertilizerScore} label="Fertilizer Impact" strokeColor="stroke-amber-500" />
              <GaugeChart value={scores.carbonScore} label="Carbon Yield" strokeColor="stroke-teal-500" />
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>💡</span> AI Recommendations & Action Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-2xl border transition ${
                    rec.color === 'red'
                      ? 'bg-red-50/50 border-red-100 text-red-950'
                      : rec.color === 'emerald'
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                      : 'bg-teal-50/50 border-teal-100 text-teal-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold">{rec.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase shrink-0 ${
                        rec.color === 'red'
                          ? 'bg-red-100 text-red-800'
                          : rec.color === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs mt-1.5 leading-relaxed opacity-95">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Start Over Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setMediaFile(null);
                setStage('upload');
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition border border-slate-200 shadow-sm"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScore;
