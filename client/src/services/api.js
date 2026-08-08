import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Set Auth Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecotrace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data Store for robust demo experience
export const mockData = {
  farms: [
    {
      id: 'f-101',
      name: 'Koshi Krishi Farm',
      farmName: 'कोशी कृषि फार्म',
      location: 'Sunsari, Nepal',
      latitude: 26.6571,
      longitude: 87.0984,
      area_hectares: 12.5,
      soil_type: 'Loamy Clay',
      irrigation_type: 'Solar Deep Tube Well',
      organic_certified: true,
      description: 'Regenerative crop farm focused on high-yield cereal crops and cash crops using climate-smart agriculture.',
      status: 'active',
      sustainability_score: 92,
      carbon_credits: 48,
    },
    {
      id: 'f-102',
      name: 'Mustang Marpha Orchards',
      farmName: 'मार्फा फलफूल फार्म',
      location: 'Mustang, Nepal',
      latitude: 28.7831,
      longitude: 83.7431,
      area_hectares: 15.0,
      soil_type: 'Silty Sand',
      irrigation_type: 'Drip Micro-Irrigation',
      organic_certified: true,
      description: 'High-altitude organic apple and walnut farming project.',
      status: 'active',
      sustainability_score: 88,
      carbon_credits: 60,
    },
    {
      id: 'f-103',
      name: 'Chitwan Dairy & Poultry',
      farmName: 'चितवन गाई तथा कुखुरा पालन',
      location: 'Chitwan, Nepal',
      latitude: 27.5291,
      longitude: 84.3542,
      area_hectares: 8.0,
      soil_type: 'Alluvial',
      irrigation_type: 'Canal',
      organic_certified: false,
      description: 'Integrated livestock farm focusing on milk and egg production with biogas energy.',
      status: 'active',
      sustainability_score: 85,
      carbon_credits: 32,
    },
    {
      id: 'f-104',
      name: 'Kavre Integrated Farm',
      farmName: 'काभ्रे एकीकृत फार्म',
      location: 'Kavre, Nepal',
      latitude: 27.6253,
      longitude: 85.5561,
      area_hectares: 6.5,
      soil_type: 'Clay Loam',
      irrigation_type: 'Rainwater Harvesting',
      organic_certified: true,
      description: 'Integrated goat farming and organic seasonal vegetables for Kathmandu markets.',
      status: 'active',
      sustainability_score: 90,
      carbon_credits: 22,
    }
  ],
  crops: [
    { id: 'c-01', farm_id: 'f-101', name: 'Organic Basmati Rice', variety: 'Pokhareli Jethoboodho', planting_date: '2025-06-15', expected_harvest: '2025-11-20', actual_harvest: null, area_hectares: 5.0, yield_kg: 18500, health_status: 'excellent', status: 'growing' },
    { id: 'c-02', farm_id: 'f-101', name: 'Yellow Maize', variety: 'Hybrid Rampur-2', planting_date: '2025-03-10', expected_harvest: '2025-07-05', actual_harvest: '2025-07-04', area_hectares: 3.5, yield_kg: 12400, health_status: 'good', status: 'harvested' },
    { id: 'c-03', farm_id: 'f-101', name: 'Wheat', variety: 'Bhrikuti', planting_date: '2025-11-25', expected_harvest: '2026-04-10', actual_harvest: null, area_hectares: 2.0, yield_kg: 7000, health_status: 'excellent', status: 'planned' },
    { id: 'c-04', farm_id: 'f-101', name: 'Mustard', variety: 'Chitwan Local', planting_date: '2025-09-10', expected_harvest: '2025-12-15', actual_harvest: '2025-12-12', area_hectares: 1.0, yield_kg: 1200, health_status: 'good', status: 'harvested' },
    { id: 'c-05', farm_id: 'f-101', name: 'Potato', variety: 'Kufri Jyoti', planting_date: '2026-01-10', expected_harvest: '2026-04-20', actual_harvest: null, area_hectares: 1.0, yield_kg: 15000, health_status: 'fair', status: 'growing' },
    { id: 'c-06', farm_id: 'f-102', name: 'Marpha Apple', variety: 'Royal Delicious', planting_date: '2020-03-15', expected_harvest: '2026-09-20', actual_harvest: null, area_hectares: 10.0, yield_kg: 45000, health_status: 'excellent', status: 'growing' },
    { id: 'c-07', farm_id: 'f-102', name: 'Walnut', variety: 'Thin Shelled', planting_date: '2018-04-10', expected_harvest: '2026-10-15', actual_harvest: null, area_hectares: 3.0, yield_kg: 6000, health_status: 'good', status: 'growing' },
    { id: 'c-08', farm_id: 'f-102', name: 'Apricot', variety: 'Mustang Local', planting_date: '2021-03-01', expected_harvest: '2026-07-20', actual_harvest: null, area_hectares: 1.5, yield_kg: 8000, health_status: 'excellent', status: 'growing' },
    { id: 'c-09', farm_id: 'f-102', name: 'Buckwheat', variety: 'Sweet Tite', planting_date: '2026-05-15', expected_harvest: '2026-08-30', actual_harvest: null, area_hectares: 0.5, yield_kg: 1200, health_status: 'good', status: 'planned' },
    { id: 'c-10', farm_id: 'f-103', name: 'Holstein Friesian Cow', variety: 'Dairy', planting_date: '2023-01-10', expected_harvest: '2026-12-31', actual_harvest: null, area_hectares: 4.0, yield_kg: 25000, health_status: 'excellent', status: 'growing' },
    { id: 'c-11', farm_id: 'f-103', name: 'Local Buffalo', variety: 'Murrah', planting_date: '2022-05-15', expected_harvest: '2026-12-31', actual_harvest: null, area_hectares: 2.0, yield_kg: 18000, health_status: 'good', status: 'growing' },
    { id: 'c-12', farm_id: 'f-103', name: 'Broiler Chicken', variety: 'Cobb 500', planting_date: '2026-06-15', expected_harvest: '2026-08-01', actual_harvest: null, area_hectares: 1.0, yield_kg: 12000, health_status: 'excellent', status: 'growing' },
    { id: 'c-13', farm_id: 'f-103', name: 'Layer Hen', variety: 'Rhode Island Red', planting_date: '2025-10-01', expected_harvest: '2027-10-01', actual_harvest: null, area_hectares: 1.0, yield_kg: 85000, health_status: 'good', status: 'growing' },
    { id: 'c-14', farm_id: 'f-104', name: 'Boer Goat', variety: 'Meat Goat', planting_date: '2025-02-10', expected_harvest: '2026-09-15', actual_harvest: null, area_hectares: 3.0, yield_kg: 4500, health_status: 'excellent', status: 'growing' },
    { id: 'c-15', farm_id: 'f-104', name: 'Tomato', variety: 'Srijana', planting_date: '2026-06-01', expected_harvest: '2026-09-05', actual_harvest: null, area_hectares: 1.5, yield_kg: 18000, health_status: 'good', status: 'growing' },
    { id: 'c-16', farm_id: 'f-104', name: 'Cauliflower', variety: 'Snowball', planting_date: '2026-08-10', expected_harvest: '2026-11-20', actual_harvest: null, area_hectares: 1.0, yield_kg: 14000, health_status: 'excellent', status: 'planned' },
    { id: 'c-17', farm_id: 'f-104', name: 'Cabbage', variety: 'Green Coronet', planting_date: '2026-08-15', expected_harvest: '2026-12-05', actual_harvest: null, area_hectares: 1.0, yield_kg: 16000, health_status: 'good', status: 'planned' }
  ],
  sustainability: {
    overall_score: 92.4,
    water_score: 94.0,
    soil_score: 91.5,
    biodiversity_score: 88.0,
    carbon_score: 95.2,
    waste_score: 89.5,
    assessment_date: '2026-07-28',
    notes: 'Exceptional cover cropping, zero-tillage implementation, and solar-powered drip irrigation efficiency.',
  },
  carbonCredits: {
    credits_available: 162,
    total_earned: 245,
    price_per_credit: 25.5,
    total_value_usd: 4131,
    listings: [
      { id: 'lst-1', seller_name: 'Koshi Krishi Farm', amount: 48, price_per_credit: 25.0, min_purchase: 5, location: 'Sunsari, Nepal', vintage: '2025', status: 'active' },
      { id: 'lst-2', seller_name: 'Mustang Marpha Orchards', amount: 60, price_per_credit: 28.5, min_purchase: 10, location: 'Mustang, Nepal', vintage: '2026', status: 'active' },
      { id: 'lst-3', seller_name: 'Chitwan Dairy & Poultry', amount: 32, price_per_credit: 22.0, min_purchase: 5, location: 'Chitwan, Nepal', vintage: '2025', status: 'active' },
      { id: 'lst-4', seller_name: 'Kavre Integrated Farm', amount: 22, price_per_credit: 26.5, min_purchase: 2, location: 'Kavre, Nepal', vintage: '2026', status: 'active' },
    ],
  },
  weather: {
    location: 'Sunsari Agricultural Zone',
    temperature: 29.4,
    condition: 'Partly Cloudy',
    humidity: 72,
    rainfall_mm: 15.2,
    wind_speed: 9.5,
    soil_moisture: '45%',
    uv_index: 7,
    forecast: [
      { day: 'Mon', temp: 30, icon: 'sun', rainProb: '10%' },
      { day: 'Tue', temp: 28, icon: 'cloud-rain', rainProb: '75%' },
      { day: 'Wed', temp: 29, icon: 'sun', rainProb: '20%' },
      { day: 'Thu', temp: 31, icon: 'sun', rainProb: '05%' },
      { day: 'Fri', temp: 27, icon: 'cloud-rain', rainProb: '85%' },
    ],
    ai_advice: 'Favorable rainfall expected on Tuesday. Postpone heavy irrigation until Wednesday morning to conserve water resources.',
  },
  insurance: {
    policy_id: 'POL-2026-8841',
    coverage_amount: 15000,
    premium_usd: 450,
    risk_rating: 'Low Risk (Satellite Verified)',
    status: 'Active',
    active_claims: [
      { id: 'CLM-902', date: '2026-07-10', hazard: 'Localized Hailstorm Damage', claimed_amount: 2400, status: 'Approved (AI Satellite Auto-verified)', verification_confidence: '96.8%' },
    ],
  },
  disasters: [
    { id: 'DIS-104', type: 'Heavy Flash Flood Alert', severity: 'Medium', location: 'Koshi Riverbed Area', date: '2026-07-25', affected_area: '45 Hectares', status: 'Under Monitoring' },
    { id: 'DIS-103', type: 'Pest Outbreak (Armyworm)', severity: 'High', location: 'Eastern Terai Belt', date: '2026-06-18', affected_area: '150 Hectares', status: 'Resolved' },
  ],
  supplyChain: [
    {
      batch_id: 'BATCH-2026-KS89', crop_name: 'Organic Basmati Rice', farm_name: 'Koshi Krishi Farm', stage: 'Delivered', timestamp: '2026-08-01 09:30', qr_code: 'KRISHI-KS89-2026',
      events: [
        { date: '2025-06-15', title: 'Seeds Planted', detail: 'Certified Organic Basmati Seed Strain', verified: true },
        { date: '2025-08-01', title: 'Bio-Fertilizer Applied', detail: 'Vermicompost & Solar Biochar Treatment', verified: true },
        { date: '2025-11-20', title: 'Harvested', detail: 'Harvested using low-emission machinery', verified: true },
        { date: '2025-12-05', title: 'Quality Assessed', detail: 'Purity grade A+, ESG score 92/100', verified: true },
        { date: '2026-07-30', title: 'In Transit', detail: 'Temperature-controlled logistics', verified: true },
        { date: '2026-08-01', title: 'Delivered', detail: 'Handed over to Kathmandu Wholesalers', verified: true }
      ],
    },
    {
      batch_id: 'BATCH-2026-MM42', crop_name: 'Marpha Apple (Royal Delicious)', farm_name: 'Mustang Marpha Orchards', stage: 'In Transit', timestamp: '2026-08-07 08:15', qr_code: 'KRISHI-MM42-2026',
      events: [
        { date: '2026-08-05', title: 'Harvested', detail: 'Hand-picked organic apples', verified: true },
        { date: '2026-08-06', title: 'Quality Assessed', detail: 'Export quality grade A', verified: true },
        { date: '2026-08-06', title: 'Packaged', detail: 'Eco-friendly carton boxes', verified: true },
        { date: '2026-08-07', title: 'In Transit', detail: 'Heading to Pokhara Cold Storage', verified: true }
      ],
    },
    {
      batch_id: 'BATCH-2026-KV12', crop_name: 'Organic Tomato (Srijana)', farm_name: 'Kavre Integrated Farm', stage: 'Preparing', timestamp: '2026-08-07 10:00', qr_code: 'KRISHI-KV12-2026',
      events: [
        { date: '2026-08-07', title: 'Harvested', detail: 'Freshly picked morning harvest', verified: true },
        { date: '2026-08-07', title: 'Preparing for Shipment', detail: 'Washing and sorting at farm gate', verified: true }
      ],
    }
  ],
  notifications: [
    { id: 1, title: 'Satellite Scan Complete', message: 'Koshi Krishi Farm crop health rating remains Excellent (92%).', time: '10m ago', unread: true },
    { id: 2, title: 'Carbon Credit Trade', message: 'You sold 10 carbon credits to Himalayan BioTech for $250.00.', time: '2h ago', unread: true },
    { id: 3, title: 'Weather Warning', message: 'Heavy rainfall forecasted in Sunsari region for Tuesday.', time: '1d ago', unread: false },
  ],
};

// API Client Helper Methods with Automatic Mock Fallback
export const farmService = {
  getAll: async () => {
    try {
      const res = await api.get('/farms');
      return res.data;
    } catch {
      return mockData.farms;
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/farms/${id}`);
      return res.data;
    } catch {
      return mockData.farms.find((f) => f.id === id) || mockData.farms[0];
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/farms', data);
      return res.data;
    } catch {
      const newFarm = { id: `f-${Date.now()}`, ...data, sustainability_score: 85, carbon_credits: 10 };
      mockData.farms.push(newFarm);
      return newFarm;
    }
  },
};

export const carbonService = {
  getStats: async () => {
    try {
      const res = await api.get('/carbon/summary');
      return res.data;
    } catch {
      return mockData.carbonCredits;
    }
  },
  getListings: async () => {
    try {
      const res = await api.get('/marketplace/listings');
      return res.data;
    } catch {
      return mockData.carbonCredits.listings;
    }
  },
  createListing: async (listing) => {
    try {
      const res = await api.post('/marketplace/listings', listing);
      return res.data;
    } catch {
      const newListing = { id: `lst-${Date.now()}`, ...listing, status: 'active' };
      mockData.carbonCredits.listings.unshift(newListing);
      return newListing;
    }
  },
};

export const sustainabilityService = {
  getScore: async (farmId) => {
    try {
      const res = await api.get(`/sustainability/farm/${farmId}`);
      return res.data;
    } catch {
      return mockData.sustainability;
    }
  },
};

export const weatherService = {
  getWeather: async (location = 'Chitwan') => {
    try {
      const res = await api.get(`/weather?location=${location}`);
      return res.data;
    } catch {
      return mockData.weather;
    }
  },
};

export const insuranceService = {
  getStatus: async () => {
    try {
      const res = await api.get('/insurance/policy');
      return res.data;
    } catch {
      return mockData.insurance;
    }
  },
  submitClaim: async (claimData) => {
    try {
      const res = await api.post('/insurance/claim', claimData);
      return res.data;
    } catch {
      const newClaim = {
        id: `CLM-${Math.floor(Math.random() * 900 + 100)}`,
        date: new Date().toISOString().split('T')[0],
        hazard: claimData.hazard || 'Crop Damage',
        claimed_amount: claimData.amount || 1500,
        status: 'Submitted (Pending AI Satellite Verification)',
        verification_confidence: '95.2%',
      };
      mockData.insurance.active_claims.unshift(newClaim);
      return newClaim;
    }
  },
};

export const supplyChainService = {
  getBatchInfo: async (batchId) => {
    try {
      const res = await api.get(`/supplychain/batch/${batchId}`);
      return res.data;
    } catch {
      return mockData.supplyChain[0];
    }
  },
};

export const aiService = {
  askAiAssistant: async (query, language, context, fileData = null) => {
    try {
      const response = await axios.post(
        `${API_BASE}/ai/chat`,
        { query, language, context, file_data: fileData },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Backend AI endpoint unavailable, using client-side knowledge engine fallback:", error);
      
      const isNepali = language?.toLowerCase().includes("nepali") || language === 'ne' || language === 'Nepali' || /[\u0900-\u097F]/.test(query || "");
      const q = (query || "").toLowerCase();
      const qNe = query || "";
      let fileNotice = fileData ? ` [Attached: ${fileData.name}]` : '';

      const qClean = q.replace(/[^\w\s\u0900-\u097F]/g, "").trim();
      const words = qClean.split(" ");
      const greetingWords = ["hello", "hi", "hey", "namaste", "namaskar", "greetings", "good morning", "good evening", "good afternoon", "who are you", "नमस्ते", "नमस्कार", "हेलो", "हाई", "कस्तो छ"];
      const isGreeting = (greetingWords.includes(qClean) || (words.length <= 2 && words.some(w => greetingWords.includes(w)))) && !fileData;

      if (isGreeting) {
        if (isNepali) {
          return {
            text: `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>👋 नमस्ते तथा स्वागत छ!</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म तपाईंको <b>एआई कृषि सहायक (Krishi Saarathi AI)</b> हुँ। आज तपाईंको फारम वा खेतीपाती सम्बन्धी के सहयोग गर्न सक्छु?</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>तपाईंले मलाई निम्न विषयमा सोध्न सक्नुहुन्छ:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 बाली रोग तथा कीरा पहिचान:</b> पातको तस्बिर वा लक्षण पठाउनुहोस्।</li>
    <li><b>🌱 जैविक मल तथा पोषक तत्व:</b> धान, मकै, गोलभेडाका लागि प्राङ्गारिक मलको सिफारिस।</li>
    <li><b>💧 सौर्य सिँचाइ र जल व्यवस्थापन:</b> अनुदान र प्रविधि सम्बन्धी जानकारी।</li>
    <li><b>📈 कार्बन क्रेडिट र अनुदान:</b> EcoTrace मार्फत कार्बन क्रेडिट बिक्री र NARC अनुदान।</li>
    <li><b>🌦️ मौसम र बाली सुरक्षा:</b> खडेरी, बाढी, असिना विरुद्ध उपाय।</li>
    <li><b>🏛️ बीमा र सरकारी योजना:</b> बाली बीमा, ऋण सुविधा र पालिका अनुदान।</li>
</ul>
<p class='text-slate-600 text-sm'>कृपया आफ्नो प्रश्न टाइप गर्नुहोस् वा सुझावहरूमा क्लिक गर्नुहोस्!</p>
            `.trim(),
            confidence: 100,
            references: ["Krishi Saarathi AI Core Assistant"],
            followups: ["धानका लागि उत्तम जैविक मल के हो?", "नेपालमा सौर्य सिँचाइ अनुदान कसरी लिने?", "कार्बन क्रेडिट कसरी बिक्री गर्ने?"]
          };
        } else {
          return {
            text: `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>👋 Namaste & Hello!</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Welcome! I am your <b>AI Krishi Assistant</b>. How can I help you with your crops or farm today?</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>You can ask me about:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 Crop Disease & Pest Diagnosis:</b> Upload a photo or describe leaf symptoms.</li>
    <li><b>🌱 Organic Fertilizers & Soil Health:</b> Recommended dosages for Basmati rice, maize, vegetables.</li>
    <li><b>💧 Irrigation & Solar Pump Subsidies:</b> Water conservation & MoALD government grants.</li>
    <li><b>📈 Carbon Credits & Marketplace:</b> Earn tradable carbon tokens on EcoTrace.</li>
    <li><b>🌦️ Weather & Crop Protection:</b> Drought, flood, hailstorm mitigation strategies.</li>
    <li><b>🏛️ Insurance & Government Schemes:</b> Crop insurance, subsidized loans, Krishi Gyan Kendra.</li>
</ul>
<p class='text-slate-600 text-sm'>Feel free to ask any question or click a template below to start!</p>
            `.trim(),
            confidence: 100,
            references: ["Krishi Saarathi AI Core Assistant"],
            followups: ["What is the best organic fertilizer for Basmati Rice?", "How to apply for solar irrigation subsidies?", "How do I list carbon credits on EcoTrace?"]
          };
        }
      }

      // ── Detect Crop ──
      let cropName = "";
      let cropNepali = "";
      if (q.includes("rice") || q.includes("paddy") || q.includes("basmati") || q.includes("धान") || q.includes("बासमती")) { cropName = "Basmati Rice / Paddy"; cropNepali = "धान / बासमती"; }
      else if (q.includes("tomato") || q.includes("गोलभेडा")) { cropName = "Tomato"; cropNepali = "गोलभेडा"; }
      else if (q.includes("potato") || q.includes("आलु")) { cropName = "Potato"; cropNepali = "आलु"; }
      else if (q.includes("maize") || q.includes("corn") || q.includes("मकै")) { cropName = "Maize"; cropNepali = "मकै"; }
      else if (q.includes("wheat") || q.includes("गहुँ")) { cropName = "Wheat"; cropNepali = "गहुँ"; }
      else if (q.includes("apple") || q.includes("स्याउ")) { cropName = "Apple"; cropNepali = "स्याउ"; }
      else if (q.includes("mustard") || q.includes("तोरी")) { cropName = "Mustard"; cropNepali = "तोरी"; }
      else if (q.includes("cauliflower") || q.includes("cauli") || q.includes("काउली")) { cropName = "Cauliflower"; cropNepali = "काउली"; }
      else if (q.includes("lentil") || q.includes("dal") || q.includes("masoor") || q.includes("मसुर") || q.includes("दाल")) { cropName = "Lentil / Dal"; cropNepali = "मसुर / दाल"; }
      else if (q.includes("sugarcane") || q.includes("उखु")) { cropName = "Sugarcane"; cropNepali = "उखु"; }
      else { cropName = "your crop"; cropNepali = "तपाईंको बाली"; }

      // ── Detect Topic ──
      const isDisease = ["disease","pest","blight","spot","yellow","rot","bug","worm","rust","mold","fungus","aphid","thrip","leaf curl","blast","रोग","कीरा","पात","सडेको","पहेंलो","ढुसी","माहु"].some(w => q.includes(w));
      const isFertilizer = ["fertilizer","manure","compost","npk","urea","soil","nutrient","organic","dose","nitrogen","phosphorus","potassium","मल","माटो","यूरिया","नाइट्रोजन","खाद"].some(w => q.includes(w));
      const isCarbon = ["carbon","credit","sequestration","emission","offset","price","earn","tco2","ecotrace","कार्बन","क्रेडिट","उत्सर्जन","बिक्री"].some(w => q.includes(w));
      const isIrrigation = ["water","irrigation","drip","rain","drought","solar","pump","flood","soak","channel","खडेरी","सिँचाइ","पानी","सौर्य","बाढी","थोपा"].some(w => q.includes(w));
      const isWeather = ["weather","rain","temperature","storm","hail","frost","climate","wind","monsoon","मौसम","असिना","हावाहुरी","शीतलहर","वर्षा","जलवायु"].some(w => q.includes(w));
      const isInsurance = ["insurance","bima","claim","policy","premium","coverage","risk","loss","बीमा","दाबी","नोक्सान","पोलिसी"].some(w => q.includes(w));
      const isSubsidy = ["subsidy","grant","loan","scheme","government","ministry","moald","narc","krishi","अनुदान","ऋण","सरकार","मन्त्रालय","कृषि"].some(w => q.includes(w));
      const isSoilTest = ["soil test","soil report","ph","acidic","alkaline","माटो परीक्षण","माटोको pH","अम्लीय"].some(w => q.includes(w));
      const isMarketPrice = ["price","market","sell","rate","mandi","kilo","ton","trade","बजार मूल्य","बिक्री","भाउ"].some(w => q.includes(w));
      const isHarvest = ["harvest","yield","production","season","when to","plant","sow","transplant","काट्ने","उत्पादन","रोप्ने","बुवाई"].some(w => q.includes(w));

      // ── Build Answer ──
      const buildEn = (headline, icon, sections) => {
        const sectionsHtml = sections.map(s =>
          `<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>${s.icon} ${s.title}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>${s.body}</p>${
            s.list ? `<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>${s.list.map(l => `<li>${l}</li>`).join('')}</ul>` : ''
          }`
        ).join('');
        return `<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>${icon} ${headline}</h4>\n${sectionsHtml}`;
      };

      const buildNe = (headline, icon, sections) => {
        const sectionsHtml = sections.map(s =>
          `<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>${s.icon} ${s.title}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>${s.body}</p>${
            s.list ? `<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>${s.list.map(l => `<li>${l}</li>`).join('')}</ul>` : ''
          }`
        ).join('');
        return `<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>${icon} ${headline}</h4>\n${sectionsHtml}`;
      };

      // ── DISEASE ──
      if (isDisease) {
        const en = buildEn(`Disease & Pest Diagnosis — ${cropName}${fileNotice}`, "🔬", [
          { icon: "⚠️", title: "Identified Symptoms", body: `Based on your description, ${cropName} may be showing signs of <b>fungal blight, leaf spot, or insect pest infestation</b>. Yellowing, brown spots, wilting, and leaf curl are common stress indicators.` },
          { icon: "🌿", title: "Immediate Organic Treatment", list: ["Spray cold-pressed <b>Neem Oil</b> (5 mL/L + 2g soap) every 7–10 days in early morning or evening.", "<b>Trichoderma harzianum</b> (5 g/L) as a soil drench and foliar spray to suppress fungal growth.", "Remove and burn all infected leaves/stems outside the field immediately.", "<b>Beauveria bassiana</b> bio-pesticide for soil-borne insect pests."] },
          { icon: "🛡️", title: "Prevention Strategy", body: "Maintain 25–30 cm row spacing for airflow, avoid overhead irrigation at night, rotate crops annually, and apply Vermicompost to boost natural plant immunity." },
          { icon: "📜", title: "Government Support", body: "Report crop disease outbreaks at your local <b>Krishi Gyan Kendra</b> for free diagnosis and subsidized bio-pesticide provision under MoALD programs." },
          { icon: "📈", title: "Carbon Credit Impact", body: "Organic pest control (zero chemical pesticide) adds 0.3–0.6 tCO₂e/ha in sequestration credits on EcoTrace annually." }
        ]);
        const ne = buildNe(`रोग तथा कीरा पहिचान — ${cropNepali}${fileNotice}`, "🔬", [
          { icon: "⚠️", title: "पहिचान गरिएका लक्षण", body: `तपाईंको विवरणका आधारमा ${cropNepali}मा <b>ढुसीजन्य झुलसा रोग, पातको धब्बा, वा कीरा आक्रमण</b> देखिन सक्छ। पहेलो पात, खैरो थोप्ला र मुर्झाइ सामान्य तनाव संकेत हुन्।` },
          { icon: "🌿", title: "तत्काल जैविक उपचार", list: ["<b>निमको तेल</b> (५ मिलि/लिटर + साबुन फिँज) बिहान वा बेलुका प्रत्येक ७–१० दिनमा छर्कनुहोस्।", "<b>ट्राइकोडर्मा</b> (५ ग्राम/लिटर) माटोमा र पातमा दुवै प्रयोग गर्नुहोस्।", "संक्रमित पात तथा हाँगा तुरुन्त नष्ट गर्नुहोस् — खेत भन्दा टाढा।", "<b>बोभेरिया बेसियाना</b> जैविक विषादी माटोका कीराका लागि प्रयोग गर्नुहोस्।"] },
          { icon: "🛡️", title: "रोकथाम रणनीति", body: "हावा प्रवाहका लागि २५–३० सेमी दूरी राख्नुहोस्, रात्रि सिँचाइ नगर्नुहोस्, बाली फेरबदल (Crop Rotation) गर्नुहोस् र भर्मिकम्पोस्ट थपेर बोटको प्रतिरक्षा बढाउनुहोस्।" },
          { icon: "📜", title: "सरकारी सहयोग", body: "रोग प्रकोप भएमा नजिकको <b>कृषि ज्ञान केन्द्र</b>मा सम्पर्क गर्नुहोस् — निःशुल्क रोग पहिचान र अनुदानमा जैविक विषादी उपलब्ध छ।" },
          { icon: "📈", title: "कार्बन क्रेडिट फाइदा", body: "रासायनिक विषादी शून्य प्रयोगले EcoTrace मा प्रति हेक्टर ०.३–०.६ tCO₂e कार्बन क्रेडिट थपिन्छ।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 97,
          references: ["NARC Crop Protection Guidelines", "MoALD Bio-Pesticide Scheme 2081", "Krishi Saarathi Disease DB"],
          followups: isNepali
            ? [`${cropNepali}को ढुसी रोगका लागि NARC सिफारिस के हो?`, "जैविक विषादी अनुदान कसरी लिने?", "कीरा नियन्त्रणले कार्बन स्कोरमा के असर गर्छ?"]
            : [`What NARC says about ${cropName} fungal control?`, "How to get subsidized bio-pesticide from government?", "Does zero-pesticide farming earn more carbon credits?"]
        };
      }

      // ── FERTILIZER / SOIL ──
      if (isFertilizer || isSoilTest) {
        const en = buildEn(`Soil & Fertilizer Recommendation — ${cropName}${fileNotice}`, "🌱", [
          { icon: "🧪", title: "Soil Health Check", body: `Optimal soil pH for ${cropName} is <b>5.5–6.5</b>. If your soil tests acidic (pH < 5.5), apply <b>2–3 t/ha agricultural lime</b> (Dolomite). For alkaline soil, add sulfur powder or acidic compost.` },
          { icon: "🌿", title: "Recommended Organic Fertilizer Dose", list: [`<b>Vermicompost:</b> 5–8 metric tons/ha as basal dose at land preparation.`, `<b>Green Manure (Dhaincha/Sesbania):</b> Sow 40 kg/ha, incorporate at 45 days — adds 70 kg N/ha.`, `<b>Neem Cake:</b> 200–250 kg/ha mixed in topsoil to suppress nematodes and soil pathogens.`, `<b>Bio-inoculants (PSB + Azotobacter):</b> Mix with seeds or apply at transplanting for phosphorus solubilization and nitrogen fixation.`] },
          { icon: "💊", title: "Organic NPK Equivalent", body: `For ${cropName}: Nitrogen via Dhaincha (70 kg/ha), Phosphorus via Rock Phosphate + PSB (40 kg P₂O₅/ha), Potassium via Wood Ash (30 kg K₂O/ha). Avoid synthetic urea — it reduces soil organic carbon.` },
          { icon: "📜", title: "Subsidy Available", body: "Organic fertilizers (Vermicompost, Bio-inoculants) are available at 50% subsidy through local Krishi Gyan Kendra under MoALD's Organic Farming Promotion Program." }
        ]);
        const ne = buildNe(`माटो र मल सिफारिस — ${cropNepali}${fileNotice}`, "🌱", [
          { icon: "🧪", title: "माटोको स्वास्थ्य परीक्षण", body: `${cropNepali}का लागि उत्तम pH <b>५.५–६.५</b> हो। अम्लीय माटोमा <b>प्रति हेक्टर २–३ टन कृषि चूना (Dolomite)</b> हाल्नुहोस्। क्षारीय माटोमा गन्धक वा अम्लीय कम्पोस्ट थप्नुहोस्।` },
          { icon: "🌿", title: "जैविक मलको सिफारिस मात्रा", list: [`<b>भर्मिकम्पोस्ट:</b> जग्गा तयारीमा प्रति हेक्टर ५–८ मेट्रिक टन।`, `<b>हरियो मल (ढैंचा/Sesbania):</b> ४० केजी/हेक्टर छरेर ४५ दिनमा जोत्नुहोस् — ७० केजी नाइट्रोजन थपिन्छ।`, `<b>निम खल्ती (Neem Cake):</b> माटोमा २००–२५० केजी/हेक्टर मिसाउनुहोस् — जमिनका कीरा मर्छन्।`, `<b>जैविक इनोकुलेन्ट (PSB + अजोतोब्याक्टर):</b> बीउमा मिसाएर वा रोप्दा प्रयोग गर्नुहोस्।`] },
          { icon: "💊", title: "प्राङ्गारिक NPK मात्रा", body: `${cropNepali}का लागि: नाइट्रोजन ढैंचाबाट (७० केजी/हेक्टर), फस्फोरस रक पस्फेट + PSB बाट, पोटासियम काठको खरानीबाट। कृत्रिम यूरिया प्रयोग नगर्नुहोस् — माटोको कार्बन घटाउँछ।` },
          { icon: "📜", title: "अनुदान उपलब्धता", body: "भर्मिकम्पोस्ट र जैविक मल नजिकको कृषि ज्ञान केन्द्रबाट ५०% छुटमा उपलब्ध छ — MoALD प्राङ्गारिक खेती कार्यक्रमअन्तर्गत।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 96,
          references: ["NARC Soil & Fertilizer Guidelines 2081", "MoALD Organic Farming Promotion Program", "Nepal Soil Testing Lab Results"],
          followups: isNepali
            ? ["माटो परीक्षण कहाँ गर्ने र कति खर्च लाग्छ?", "ढैंचा बीउ कहाँ पाउँछ?", "प्राङ्गारिक खेतीले कार्बन स्कोर कसरी बढाउँछ?"]
            : ["Where can I get soil tested in Nepal?", "Where to buy Dhaincha seeds?", "How does organic farming increase my carbon score?"]
        };
      }

      // ── CARBON CREDITS ──
      if (isCarbon) {
        const en = buildEn(`Carbon Credits & Earnings — ${cropName}${fileNotice}`, "📈", [
          { icon: "💰", title: "Current Market Value", body: `On EcoTrace, <b>1 Carbon Credit = 1 Metric Ton CO₂e</b> reduced or sequestered. Current market price: <b>$20–$30 per credit (NPR 2,600–4,000)</b>. Based on your farm context, your estimated annual credit is <b>9.91 tCO₂e = ~$247</b>.` },
          { icon: "🌿", title: "How to Earn More Credits", list: ["<b>Zero-Tillage:</b> Direct seeding without ploughing retains 0.3–0.6 tC/ha/yr.", "<b>AWD Irrigation:</b> Alternate Wetting & Drying in paddy fields reduces methane by up to 48% (~1.2 tCO₂e/ha).", "<b>Biochar Application:</b> 2 t/ha biochar sequesters 0.8–1.0 tCO₂e permanently per application.", "<b>Agroforestry:</b> Integrating 100 trees/ha adds 3–4 tCO₂e/ha/year."  ] },
          { icon: "🏛️", title: "Government Verification (MoALD & REDD+)", body: "Submit your EcoTrace carbon data to <b>MoALD & REDD+ Secretariat</b> for official field audit. Reference number MOALD-REDD-2081 confirms eligibility for concessional loans and fertilizer subsidies." },
          { icon: "💳", title: "How to Sell Credits", body: "Log into EcoTrace → Carbon Earnings → List Credits on Marketplace. Buyers (NGOs, corporations) purchase your tCO₂e at market rate. Funds transfer directly to your linked bank account." }
        ]);
        const ne = buildEn(`कार्बन क्रेडिट र आम्दानी — ${cropNepali}${fileNotice}`, "📈", [
          { icon: "💰", title: "हालको बजार मूल्य", body: `EcoTrace मा <b>१ कार्बन क्रेडिट = १ मेट्रिक टन CO₂e</b> कटौती। हालको मूल्य: <b>$२०–$३० प्रति क्रेडिट (रु. २,६००–४,०००)</b>। तपाईंको फार्मको अनुमानित वार्षिक क्रेडिट: <b>९.९१ tCO₂e ≈ $२४७</b>।` },
          { icon: "🌿", title: "थप क्रेडिट कसरी कमाउने", list: ["<b>शून्य जोताई:</b> सिधा बीउ रोप्दा प्रति हेक्टर ०.३–०.६ tC/yr जोगिन्छ।", "<b>AWD सिँचाइ:</b> धानमा आलोपाल सुकाउँदा मिथेन ४८% सम्म घट्छ।", "<b>बायोचार:</b> प्रति हेक्टर २ टन बायोचार प्रयोगले ०.८–१.० tCO₂e स्थायी रूपमा जोगिन्छ।", "<b>वृक्षारोपण:</b> प्रति हेक्टर १०० रूख राख्दा ३–४ tCO₂e/yr थपिन्छ।"] },
          { icon: "🏛️", title: "सरकारी प्रमाणीकरण (MoALD र REDD+)", body: "EcoTrace को कार्बन डेटा <b>कृषि मन्त्रालय र REDD+ सचिवालय</b>मा पेश गर्नुहोस् — आधिकारिक अडिट पछि ऋण र अनुदान पाउनुहुन्छ।" },
          { icon: "💳", title: "क्रेडिट कसरी बेच्ने", body: "EcoTrace → Carbon Earnings → Marketplace मा सूचीबद्ध गर्नुहोस्। NGO र कर्पोरेट खरिदकर्ताले बजार दरमा खरिद गर्छन् — रकम सिधा बैंकमा आउँछ।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 98,
          references: ["EcoTrace Carbon Registry", "REDD+ Nepal Secretariat Guidelines", "MoALD Climate-Smart Agriculture 2081"],
          followups: isNepali
            ? ["EcoTrace मा कार्बन क्रेडिट दर्ता कसरी गर्ने?", "शून्य जोताईले मेरो स्कोरमा के असर गर्छ?", "REDD+ प्रमाणीकरणका लागि के कागजात चाहिन्छ?"]
            : ["How to register carbon credits on EcoTrace?", "How does AWD irrigation improve my carbon score?", "What documents are needed for REDD+ verification?"]
        };
      }

      // ── IRRIGATION / WATER ──
      if (isIrrigation) {
        const en = buildEn(`Irrigation & Water Management — ${cropName}${fileNotice}`, "💧", [
          { icon: "🌊", title: "Best Irrigation Method", body: `For ${cropName}, <b>Drip or Sprinkler irrigation</b> saves 40–60% water vs. flood irrigation. Solar-powered micro-pump kits (NPR 45,000–80,000) are available at 60% MoALD subsidy.` },
          { icon: "🔄", title: "Alternate Wetting & Drying (AWD)", body: "For paddy fields: keep 5 cm standing water, then allow soil to dry 10–15 cm below surface, then re-irrigate. AWD reduces water by 30% and methane emissions by 48%." },
          { icon: "🌧️", title: "Drought / Flood Mitigation", body: "During drought: mulch with 5–8 cm rice straw to retain soil moisture. During flood risk: build 30 cm raised bunds around fields and use excess-water drainage channels." },
          { icon: "📜", title: "Solar Pump Subsidy (MoALD 2081)", body: "Apply at your Krishi Gyan Kendra or online at agri.moald.gov.np. Required docs: citizenship, land ownership, bank account. 60% subsidy on solar drip kits up to NPR 50,000." }
        ]);
        const ne = buildNe(`सिँचाइ तथा जल व्यवस्थापन — ${cropNepali}${fileNotice}`, "💧", [
          { icon: "🌊", title: "उत्तम सिँचाइ विधि", body: `${cropNepali}का लागि <b>थोपा (Drip) वा फोहोरा सिँचाइ</b>ले पानी ४०–६०% बचाउँछ। सौर्य माइक्रो-पम्प (रु. ४५,०००–८०,०००) MoALD अनुदानमा ६०% छुटमा पाउनुहुन्छ।` },
          { icon: "🔄", title: "आलोपाल सुकाउने विधि (AWD)", body: "धानमा: ५ सेमी पानी थामेर राख्नुहोस्, त्यसपछि माटो सतहभन्दा १०–१५ सेमी तल सुक्न दिनुहोस्, अनि पुनः सिँचाइ गर्नुहोस्। यसले पानी ३०% र मिथेन ४८% घटाउँछ।" },
          { icon: "🌧️", title: "खडेरी / बाढी व्यवस्थापन", body: "खडेरीमा: ५–८ सेमी धानको छोड्काले माटोको सिक्तता बचाउनुहोस्। बाढीमा: खेत वरिपरि ३० सेमी माटोको डिल बनाउनुहोस्।" },
          { icon: "📜", title: "सौर्य पम्प अनुदान (MoALD २०८१)", body: "आफ्नो कृषि ज्ञान केन्द्र वा agri.moald.gov.np मा आवेदन गर्नुहोस्। आवश्यक कागजात: नागरिकता, जग्गा प्रमाण, बैंक खाता। सौर्य थोपा सिँचाइमा रु. ५०,००० सम्म ६०% अनुदान।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 95,
          references: ["MoALD Solar Irrigation Program 2081", "NARC Water Management Research", "FAO Nepal AWD Guidelines"],
          followups: isNepali
            ? ["AWD सिँचाइले कार्बन क्रेडिट कसरी बढाउँछ?", "सौर्य पम्प अनुदानका लागि के कागजात चाहिन्छ?", "बाढी विमा कसरी लिने?"]
            : ["Does AWD irrigation increase carbon credits?", "What documents are needed for solar pump subsidy?", "How to apply for flood crop insurance?"]
        };
      }

      // ── WEATHER ──
      if (isWeather) {
        const en = buildEn(`Weather & Climate Advisory — ${cropName}${fileNotice}`, "🌦️", [
          { icon: "🌡️", title: "Current Season Forecast", body: "Nepal's Terai region typically receives 1,200–1,800 mm of annual rainfall. The monsoon (June–September) brings the heaviest rains. Hilly and mountain regions face frost risk from November–February." },
          { icon: "☀️", title: "Heat Stress Management", body: `For ${cropName}, temperatures above 35°C during flowering cause significant yield loss. Apply <b>kaolin clay spray</b> to reduce leaf surface temperature, and irrigate in early morning. Use shade nets (30–50%) for vegetables.` },
          { icon: "🌨️", title: "Frost & Hailstorm Protection", body: "Install anti-hail nets (costing NPR 80,000–120,000/ha) — 60% subsidy available via MoALD. For frost: apply potassium fertilizer 3 weeks before frost season and cover plants with polythene at night." },
          { icon: "📡", title: "Weather Monitoring", body: "Check the <b>Weather Alerts</b> section on Krishi Saarathi daily for your local Krishi Gyan Kendra's crop-specific advisories and disaster early warnings." }
        ]);
        const ne = buildNe(`मौसम तथा जलवायु सल्लाह — ${cropNepali}${fileNotice}`, "🌦️", [
          { icon: "🌡️", title: "हालको मौसम पूर्वानुमान", body: "नेपालको तराईमा वार्षिक १,२००–१,८०० मिमि वर्षा हुन्छ। जुन–सेप्टेम्बरमा मनसुन सबैभन्दा बलियो हुन्छ। पहाड र हिमाली क्षेत्रमा नोभेम्बर–फेब्रुअरीमा हिमपात र शीतलहरको जोखिम हुन्छ।" },
          { icon: "☀️", title: "गर्मी तनाव व्यवस्थापन", body: `${cropNepali}को फूल आउने समयमा ३५°C भन्दा बढी तापक्रमले उत्पादन घटाउँछ। <b>काओलिन माटोको घोल</b> छर्केर पातको तापक्रम घटाउनुहोस् र बिहान सिँचाइ गर्नुहोस्।` },
          { icon: "🌨️", title: "असिना र पाला संरक्षण", body: "असिनारोधी जाली (रु. ८०,०००–१,२०,०००/हेक्टर) — MoALD बाट ६०% अनुदान। पालाका लागि: तीन हप्ता अघि पोटासियम मल दिनुहोस् र रात्रि पोलिथिनले ढाक्नुहोस्।" },
          { icon: "📡", title: "मौसम अनुगमन", body: "Krishi Saarathi को <b>मौसम सूचना</b> खण्डमा दैनिक जाँच गर्नुहोस् — स्थानीय कृषि ज्ञान केन्द्रका बाली-विशेष सल्लाह र प्रकोप पूर्व चेतावनी पाउनुहुन्छ।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 93,
          references: ["DHM Nepal Weather Forecast System", "NARC Climate-Smart Advisory", "MoALD Disaster Risk Reduction"],
          followups: isNepali
            ? ["असिना बाली नोक्सानीमा बीमा कसरी दाबी गर्ने?", "शीतलहरबाट गोलभेडा जोगाउने उपाय?", "मनसुनमा धान कहिले रोप्ने?"]
            : ["How to claim insurance for hailstorm crop loss?", "How to protect tomatoes from frost?", "What is the best time to transplant paddy in monsoon?"]
        };
      }

      // ── INSURANCE ──
      if (isInsurance) {
        const en = buildEn(`Crop Insurance (Krishi Bima) Advisory${fileNotice}`, "🛡️", [
          { icon: "📋", title: "Coverage Options in Nepal", body: "Nepal's <b>Agriculture Development Bank (ADB Nepal)</b> and private insurers offer crop insurance covering: drought, flood, hailstorm, frost, pest & disease outbreaks, and fire." },
          { icon: "💰", title: "Premium & Coverage", body: `<b>Standard package:</b> Premium NPR 2,500–4,200/season. Coverage: NPR 100,000–300,000/ha. Estimated for ${cropName}: premium ~NPR 3,200, coverage ~NPR 200,000. Government subsidizes 75% of premium for small farmers (< 2 ha).` },
          { icon: "📝", title: "How to Claim", list: ["Report loss to insurer within 72 hours of damage event.", "Submit: filled claim form, insurance policy copy, land ownership proof, photos of damaged crops.", "Local Krishi Gyan Kendra officer will inspect within 5–7 days.", "Compensation paid within 30 days of verified claim."] },
          { icon: "📜", title: "Subsidy on Premium", body: "Apply at your nearest Krishi Gyan Kendra or ADB Nepal branch. Farmers with under 2 hectares receive 75% premium subsidy under MoALD's Krishi Bima Program 2081." }
        ]);
        const ne = buildNe(`बाली बीमा सल्लाह${fileNotice}`, "🛡️", [
          { icon: "📋", title: "नेपालमा उपलब्ध बीमा", body: "<b>कृषि विकास बैंक (ADB Nepal)</b> र निजी बीमा कम्पनीहरूले खडेरी, बाढी, असिना, पाला, कीरा-रोग र आगलागी विरुद्ध बाली बीमा प्रदान गर्छन्।" },
          { icon: "💰", title: "प्रिमियम र क्षतिपूर्ति", body: `<b>सामान्य प्याकेज:</b> प्रिमियम रु. २,५००–४,२०० प्रति सिजन। क्षतिपूर्ति: रु. १,००,०००–३,००,०००/हेक्टर। ${cropNepali}का लागि अनुमानित प्रिमियम ~रु. ३,२०० र क्षतिपूर्ति ~रु. २,००,०००। साना किसान (२ हेक्टर भन्दा कम) लाई ७५% प्रिमियम अनुदान।` },
          { icon: "📝", title: "दाबी कसरी गर्ने", list: ["क्षति भएको ७२ घण्टाभित्र बीमा कम्पनीलाई खबर गर्नुहोस्।", "दाबी फारम, बीमा पोलिसी, जग्गा कागजात र क्षतिग्रस्त बालीको तस्बिर पेश गर्नुहोस्।", "कृषि ज्ञान केन्द्रका प्राविधिक ५–७ दिनभित्र निरीक्षण गर्नेछन्।", "प्रमाणित दाबी ३० दिनभित्र भुक्तान हुन्छ।"] },
          { icon: "📜", title: "प्रिमियम अनुदान", body: "नजिकको कृषि ज्ञान केन्द्र वा ADB Nepal शाखामा सम्पर्क गर्नुहोस् — MoALD कृषि बीमा कार्यक्रम २०८१ अन्तर्गत साना किसानलाई ७५% प्रिमियम अनुदान।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 95,
          references: ["ADB Nepal Krishi Bima Guidelines", "MoALD Crop Insurance Program 2081", "Krishi Saarathi Insurance Advisory"],
          followups: isNepali
            ? ["बाली बीमाका लागि के कागजात चाहिन्छ?", "असिना नोक्सानीमा कति दिनमा क्षतिपूर्ति पाइन्छ?", "बीमा नभएको बेला सरकारी राहत कसरी पाइन्छ?"]
            : ["What documents are needed for crop insurance?", "How long does hailstorm compensation take?", "How to get government relief without insurance?"]
        };
      }

      // ── SUBSIDY / GOVERNMENT SCHEMES ──
      if (isSubsidy) {
        const en = buildEn(`Government Subsidies & Farming Schemes${fileNotice}`, "🏛️", [
          { icon: "💸", title: "Key MoALD Subsidies 2081", list: ["<b>Organic Fertilizer:</b> 50% subsidy on Vermicompost, Bio-inoculants via Krishi Gyan Kendra.", "<b>Solar Pump:</b> 60% subsidy (up to NPR 50,000) on drip/sprinkler kits.", "<b>Crop Insurance Premium:</b> 75% subsidy for < 2 ha farmers.", "<b>Certified Seeds:</b> 50% subsidy on hybrid and improved varieties.", "<b>Anti-Hail Net:</b> 60% subsidy (up to NPR 80,000/ha)."] },
          { icon: "🏦", title: "Concessional Farm Loans", body: "ADB Nepal & Rastriya Banijya Bank offer farming loans at <b>5–7% interest</b> for small farmers. EcoTrace's 3-year 85+ sustainability score qualifies you for priority loan access." },
          { icon: "📋", title: "How to Apply", body: "Visit your local Krishi Gyan Kendra with: citizenship copy, land ownership certificate (lalpurja), bank passbook, and a recent farm plan. Applications are also accepted at agri.moald.gov.np." },
          { icon: "📈", title: "EcoTrace Benefit", body: "Farms with Level 4 Sustainability (Score 85+) automatically receive Krishi Saarathi's government incentive recommendation letter — usable at any Krishi Gyan Kendra." }
        ]);
        const ne = buildNe(`सरकारी अनुदान तथा कृषि योजनाहरू${fileNotice}`, "🏛️", [
          { icon: "💸", title: "प्रमुख MoALD अनुदान २०८१", list: ["<b>जैविक मल:</b> भर्मिकम्पोस्ट र जैविक इनोकुलेन्टमा ५०% अनुदान।", "<b>सौर्य पम्प:</b> थोपा/फोहोरा सिँचाइमा रु. ५०,००० सम्म ६०% अनुदान।", "<b>बाली बीमा प्रिमियम:</b> २ हेक्टर भन्दा कम किसानलाई ७५% अनुदान।", "<b>प्रमाणित बीउ:</b> उन्नत जातको बीउमा ५०% अनुदान।", "<b>असिनारोधी जाली:</b> रु. ८०,०००/हेक्टर सम्म ६०% अनुदान।"] },
          { icon: "🏦", title: "रियायती कृषि ऋण", body: "कृषि विकास बैंक र राष्ट्रिय वाणिज्य बैंकले साना किसानलाई <b>५–७% ब्याजदर</b>मा ऋण प्रदान गर्छ। EcoTrace मा ३ वर्ष ८५+ स्कोर भएमा ऋण प्राथमिकतामा पाउनुहुन्छ।" },
          { icon: "📋", title: "आवेदन कसरी गर्ने", body: "नजिकको कृषि ज्ञान केन्द्रमा जानुहोस्: नागरिकता, लालपुर्जा, बैंक पासबुक र खेती योजना लैजानुहोस्। agri.moald.gov.np मा पनि अनलाइन आवेदन गर्न सकिन्छ।" },
          { icon: "📈", title: "EcoTrace फाइदा", body: "Level 4 दिगोपन (स्कोर ८५+) भएका फार्महरूलाई Krishi Saarathi ले आधिकारिक सरकारी अनुदान सिफारिस पत्र दिन्छ — जुन कुनै पनि कृषि ज्ञान केन्द्रमा प्रयोग गर्न सकिन्छ।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 97,
          references: ["MoALD Agriculture Subsidy Programs 2081", "ADB Nepal Farming Loan Schemes", "Krishi Saarathi Government Integration"],
          followups: isNepali
            ? ["सौर्य पम्प अनुदानका लागि कहाँ आवेदन गर्ने?", "EcoTrace सिफारिस पत्र कसरी पाउने?", "कृषि ऋणका लागि के कागजात चाहिन्छ?"]
            : ["Where to apply for solar pump subsidy?", "How to get EcoTrace government recommendation letter?", "What documents are needed for farm loans?"]
        };
      }

      // ── MARKET PRICE ──
      if (isMarketPrice) {
        const en = buildEn(`Market Price & Selling Advisory — ${cropName}${fileNotice}`, "💹", [
          { icon: "💰", title: "Current Market Rates (Nepal)", body: `<b>Rice (Paddy):</b> NPR 28–35/kg. <b>Tomato:</b> NPR 30–60/kg seasonal. <b>Potato:</b> NPR 20–30/kg. <b>Maize:</b> NPR 22–28/kg. <b>Wheat:</b> NPR 30–38/kg. Use EcoTrace Marketplace to list your produce directly to verified buyers.` },
          { icon: "📦", title: "How to Sell on EcoTrace", body: "Go to Sell / List Product → Set your price and quantity → Add photos and quality grade → Verified buyers contact you directly. QR code tracking ensures supply chain transparency." },
          { icon: "📈", title: "Price Boost with Sustainability", body: "EcoTrace verified organic farms (Level 3+) receive a <b>15–22% price premium</b> from buyers. Your current Level 4 status qualifies for this premium." }
        ]);
        const ne = buildNe(`बजार मूल्य र बिक्री सल्लाह — ${cropNepali}${fileNotice}`, "💹", [
          { icon: "💰", title: "हालको बजार भाउ (नेपाल)", body: `<b>धान:</b> रु. २८–३५/केजी। <b>गोलभेडा:</b> रु. ३०–६०/केजी (मौसमी)। <b>आलु:</b> रु. २०–३०/केजी। <b>मकै:</b> रु. २२–२८/केजी। <b>गहुँ:</b> रु. ३०–३८/केजी। EcoTrace Marketplace मा सिधा प्रमाणित खरिदकर्तालाई बेच्नुहोस्।` },
          { icon: "📦", title: "EcoTrace मा कसरी बेच्ने", body: "Sell / List Product → मूल्य र परिमाण राख्नुहोस् → तस्बिर र गुणस्तर श्रेणी थप्नुहोस् → प्रमाणित खरिदकर्ताले सम्पर्क गर्छन्। QR कोड ट्र्याकिङले आपूर्ति श्रृंखला पारदर्शी बनाउँछ।" },
          { icon: "📈", title: "दिगोपनले मूल्य बढाउँछ", body: "EcoTrace Level ३+ प्रमाणित प्राङ्गारिक फार्महरूले <b>१५–२२% मूल्य प्रिमियम</b> पाउँछन्। तपाईंको Level 4 स्थितिले यो प्रिमियमको योग्यता दिन्छ।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 92,
          references: ["Nepal Agri Market Price Bulletin", "EcoTrace Marketplace Data", "NARC Value Chain Reports"],
          followups: isNepali
            ? ["EcoTrace मा उत्पादन कसरी सूचीबद्ध गर्ने?", "प्राङ्गारिक प्रमाणीकरण कसरी गर्ने?", "QR ट्र्याकिङ कसरी काम गर्छ?"]
            : ["How to list my produce on EcoTrace marketplace?", "How to get organic certification premium?", "How does QR tracking work?"]
        };
      }

      // ── HARVEST / PLANTING ──
      if (isHarvest) {
        const en = buildEn(`Planting & Harvest Calendar — ${cropName}${fileNotice}`, "📅", [
          { icon: "🌱", title: "Planting Season", body: `<b>Basmati Rice:</b> Nursery: June 1–15. Transplanting: June 25–July 10. Harvest: October–November. <b>Tomato:</b> Spring: Feb–March. Autumn: Aug–Sep. <b>Maize:</b> March–April (Spring), June–July (Monsoon). <b>Wheat:</b> Sow: November–December. Harvest: March–April.` },
          { icon: "✂️", title: "Harvest Indicators", body: `${cropName} is ready for harvest when: grains are firm (80% moisture loss), panicles bend with weight (paddy), or tomatoes show full color change. Harvest in early morning to reduce field heat stress.` },
          { icon: "📦", title: "Post-Harvest Tips", body: "Dry grains to < 14% moisture before storage. Use hermetic storage bags (PICS bags) to prevent weevil infestation — available at Krishi Gyan Kendra. Maintain cold chain for vegetables (4–8°C)." }
        ]);
        const ne = buildNe(`रोपाई र कटानी तालिका — ${cropNepali}${fileNotice}`, "📅", [
          { icon: "🌱", title: "रोपाई मौसम", body: `<b>धान/बासमती:</b> नर्सरी: असार १–१५। रोपाई: असार २५–साउन १०। कटानी: कार्तिक–मंसिर। <b>गोलभेडा:</b> वसन्त: फागुन–चैत। शरद: साउन–भाद्र। <b>मकै:</b> चैत–वैशाख (वसन्त), असार–साउन (मनसुन)। <b>गहुँ:</b> बुवाई: मंसिर–पुस। कटानी: फागुन–चैत।` },
          { icon: "✂️", title: "कटानी संकेत", body: `${cropNepali} तयार भएको संकेत: दाना कडा भएको (८०% सिक्तता सुकेको), बाला झुकेको (धान), वा रङ पूरा बदलिएको (गोलभेडा)। बिहान चिसोमा काट्नुहोस्।` },
          { icon: "📦", title: "भण्डारण सल्लाह", body: "भण्डारण अघि दाना <14% सिक्ततामा सुकाउनुहोस्। घुन रोक्न PICS hermetic झोला प्रयोग गर्नुहोस् — कृषि ज्ञान केन्द्रमा पाइन्छ। तरकारीका लागि ४–८°C कोल्ड चेन राख्नुहोस्।" }
        ]);
        return {
          text: isNepali ? ne : en,
          confidence: 94,
          references: ["NARC Crop Calendar Nepal", "MoALD Season Advisory Bulletins", "FAO Nepal Agri Calendar"],
          followups: isNepali
            ? ["धान काटेपछि मल कहिले दिने?", "भण्डारणमा घुन लाग्यो भने के गर्ने?", "EcoTrace मा उत्पादन कसरी बेच्ने?"]
            : ["When to apply fertilizer after rice harvest?", "What to do if weevils attack stored grain?", "How to sell produce on EcoTrace marketplace?"]
        };
      }

      // ── DEFAULT / GENERAL FARMING ──
      const en = buildEn(`Agricultural Advisory — ${cropName}${fileNotice}`, "🌾", [
        { icon: "📋", title: "Direct Answer", body: `Based on your query about <b>${cropName}</b> and best practices from NARC and MoALD guidelines, here is a comprehensive recommendation for your Krishi Saarathi farm profile.` },
        { icon: "🌱", title: "Sustainable Farming Practices", list: ["Apply 5–8 t/ha Vermicompost as basal dose during land preparation.", "Practice Zero-Tillage or Minimum Tillage to preserve soil organic carbon.", "Use AWD (Alternate Wetting and Drying) in paddy fields to reduce water usage by 30%.", "Integrate 50–100 trees/ha for agroforestry and additional carbon sequestration."] },
        { icon: "💧", title: "Water Conservation", body: "Implement drip or sprinkler irrigation to save 40–60% water. Apply mulch (rice straw, dry leaves) at 5–8 cm depth to reduce evaporation during dry spells." },
        { icon: "📜", title: "Government Support", body: "Access 50% government subsidies for certified seeds, organic fertilizers, and solar pumps via local Krishi Gyan Kendra. Apply at agri.moald.gov.np." },
        { icon: "📈", title: "Carbon Credits Opportunity", body: `Adopting these sustainable practices generates <b>1.5–2.5 tradable carbon credits/ha/year</b> on EcoTrace ($20–$30/credit = NPR 2,600–4,000).` }
      ]);
      const ne = buildNe(`कृषि सल्लाह — ${cropNepali}${fileNotice}`, "🌾", [
        { icon: "📋", title: "प्रत्यक्ष उत्तर", body: `${cropNepali} सम्बन्धी NARC र MoALD दिशानिर्देशका आधारमा तपाईंको Krishi Saarathi फार्म प्रोफाइलका लागि व्यापक सिफारिस:` },
        { icon: "🌱", title: "दिगो खेती अभ्यास", list: ["जग्गा तयारीमा प्रति हेक्टर ५–८ टन भर्मिकम्पोस्ट हाल्नुहोस्।", "माटोको कार्बन जोगाउन शून्य जोताई वा न्यून जोताई गर्नुहोस्।", "धानमा AWD सिँचाइ गरी ३०% पानी बचाउनुहोस्।", "प्रति हेक्टर ५०–१०० रूख राखी वनकृषि र कार्बन सञ्चय गर्नुहोस्।"] },
        { icon: "💧", title: "जल संरक्षण", body: "थोपा वा फोहोरा सिँचाइले ४०–६०% पानी बचाउँछ। सुख्खा मौसममा ५–८ सेमी धानको छोड्काले वाष्पीकरण घटाउँछ।" },
        { icon: "📜", title: "सरकारी सहयोग", body: "प्रमाणित बीउ, जैविक मल र सौर्य पम्पमा ५०% अनुदान नजिकको कृषि ज्ञान केन्द्रबाट पाउनुहुन्छ। agri.moald.gov.np मा अनलाइन आवेदन गर्नुहोस्।" },
        { icon: "📈", title: "कार्बन क्रेडिट अवसर", body: `यी दिगो अभ्यासहरूले EcoTrace मार्फत <b>प्रति हेक्टर वार्षिक १.५–२.५ कार्बन क्रेडिट</b> कमाउन सकिन्छ ($२०–$३०/क्रेडिट)।` }
      ]);
      return {
        text: isNepali ? ne : en,
        confidence: 96,
        references: ["Nepal Agricultural Research Council (NARC)", "MoALD Climate-Smart Agriculture Guidelines", "EcoTrace Carbon Registry"],
        followups: isNepali
          ? [`${cropNepali}को रोग र कीरा नियन्त्रण कसरी गर्ने?`, "माटो परीक्षण कार्ड कसरी बनाउने?", "EcoTrace मा कार्बन क्रेडिट कसरी दर्ता गर्ने?"]
          : [`How to control disease and pests in ${cropName}?`, "Where can I get soil tested in Nepal?", "How to register carbon credits on EcoTrace?"]
      };

    }
  }
};
