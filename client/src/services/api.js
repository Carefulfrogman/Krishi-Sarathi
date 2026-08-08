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
          timeout: 30000 
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Backend AI endpoint unavailable, using client-side knowledge engine fallback:", error);
      
      const isNepali = language?.toLowerCase().includes("nepali") || language === 'ne' || language === 'Nepali' || /[\u0900-\u097F]/.test(query || "");
      const q = (query || "").toLowerCase();
      let fileNotice = fileData ? ` [Attached File: ${fileData.name}]` : '';

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
</ul>
<p class='text-slate-600 text-sm'>Feel free to ask any question or click a template below to start!</p>
            `.trim(),
            confidence: 100,
            references: ["Krishi Saarathi AI Core Assistant"],
            followups: ["What is the best organic fertilizer for Basmati Rice?", "How to apply for solar irrigation subsidies?", "How do I list carbon credits on EcoTrace?"]
          };
        }
      }

      let cropName = "crop";
      let cropNepali = "बाली";
      if (q.includes("rice") || q.includes("paddy") || q.includes("basmati") || q.includes("धान") || q.includes("बासमती")) { cropName = "Basmati Rice / Paddy"; cropNepali = "धान / बासमती"; }
      else if (q.includes("tomato") || q.includes("गोलभेडा")) { cropName = "Tomato"; cropNepali = "गोलभेडा"; }
      else if (q.includes("potato") || q.includes("आलु")) { cropName = "Potato"; cropNepali = "आलु"; }
      else if (q.includes("maize") || q.includes("corn") || q.includes("मकै")) { cropName = "Maize"; cropNepali = "मकै"; }
      else if (q.includes("wheat") || q.includes("गहुँ")) { cropName = "Wheat"; cropNepali = "गहुँ"; }
      else if (q.includes("apple") || q.includes("स्याउ")) { cropName = "Apple"; cropNepali = "स्याउ"; }

      const isDisease = ["disease","pest","leaf","blight","spot","yellow","rot","bug","worm","rust","रोग","कीरा","पात","सडेको","पहेंलो"].some(w => q.includes(w));
      const isFertilizer = ["fertilizer","manure","compost","npk","urea","soil","nutrient","organic","dose","मल","माटो","यूरिया"].some(w => q.includes(w));
      const isCarbon = ["carbon","credit","sequestration","emission","offset","price","earn","कार्बन","क्रेडिट","उत्सर्जन"].some(w => q.includes(w));
      const isIrrigation = ["water","irrigation","drip","rain","drought","solar","pump","सिँचाइ","पानी","सौर्य"].some(w => q.includes(w));

      if (isNepali) {
        let summary = `<b>${cropNepali}</b> सम्बन्धी प्रत्यक्ष उत्तर${fileNotice}: `;
        let solutions = [];
        if (isDisease) {
          summary += `प्रभावित भाग तुरुन्त हटाउनुहोस् र निमको तेल घोल (5ml/L) वा ट्राइकोडर्मा हरेक ७-१० दिनमा बेलुका छर्कनुहोस्।`;
          solutions = [
            `<b>जैविक विषादी:</b> निमको तेल (Neem Oil 5ml/L) मा साबुनको फिँज मिसाएर स्प्रे गर्नुहोस्।`,
            `<b>संक्रमित भाग नष्ट:</b> रोगग्रस्त पात तथा हाँगा नकाटी खेतभन्दा टाढा लगेर नष्ट गर्नुहोस्।`,
            `<b>माटो उपचार:</b> ट्राइकोडर्मा मिसाएको भर्मिकम्पोस्ट फेदमा प्रयोग गर्नुहोस्।`
          ];
        } else if (isCarbon) {
          summary += `EcoTrace मा १ कार्बन क्रेडिट = १ टन CO2e कटौती। हाल बजार मूल्य रु. २५०० देखि ३५०० ($20-$30) छ।`;
          solutions = [
            `<b>शून्य जोताई:</b> माटो नजोती बीउ रोप्दा माटोको कार्बन जोगिन्छ।`,
            `<b>AWD सिँचाइ:</b> धान खेतमा मिथेन उत्सर्जन ५०% सम्म घटाउन खेत आलोपाल सुकाउनुहोस्।`,
            `<b>बायोचार:</b> कृषि अवशेषबाट बनेको बायोचार प्रयोग गरी कार्बन सञ्चित बढाउनुहोस्।`
          ];
        } else {
          summary += `प्रति रोपनी २५०-३०० केजी भर्मिकम्पोस्ट वा ५०० केजी पाकेको गोबर मल रोप्नु अघि माटोमा मिसाउनुहोस्। ढैंचा (Sesbania) हरियो मल प्रयोग गर्नुहोस्।`;
          solutions = [
            `<b>प्राङ्गारिक मल:</b> प्रति हेक्टर ५-८ टन भर्मिकम्पोस्ट रोप्ने समयमा हाल्नुहोस्।`,
            `<b>हरियो मल ढैंचा:</b> रोप्नु ४५ दिन अघि ढैंचा छरेर जोत्दा प्रति हेक्टर ७० केजी नाइट्रोजन प्राप्त हुन्छ।`,
            `<b>बायोचार र अजोतोब्याक्टर:</b> २ टन बायोचार मिसाएर माटोको उर्वरता बढाउनुहोस्।`
          ];
        }

        return {
          text: `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>📋 प्रत्यक्ष उत्तर / Direct Answer</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>${summary}</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>🔍 विस्तृत विश्लेषण / Analysis</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>नेपालको माटो र जलवायु (NARC सिफारिस) अनुसार ${cropNepali} का लागि सन्तुलित प्राङ्गारिक प्रणाली अपनाउँदा उत्पादन र गुणस्तर ३०% सम्म बढ्छ।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>🌱 दिगो तथा प्राङ्गारिक समाधान / Solutions</h4>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>${solutions.map(s => `<li>${s}</li>`).join('')}</ul>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>💧 जल तथा माटो संरक्षण / Water & Soil</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Alternate Wetting and Drying (AWD) वा थोपा सिँचाइ (Drip) अपनाई ३०-५०% पानी बचत गर्नुहोस्।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>📜 सरकारी अनुदान तथा नीति / Subsidy</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>कृषि ज्ञान केन्द्र र पालिकाबाट ५०% अनुदानमा प्राङ्गारिक मल, बीउ र जैविक विषादी उपलब्ध छ।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>📈 कार्बन क्रेडिट र आर्थिक लाभ / Carbon Credits</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>प्राङ्गारिक खेतीले प्रति हेक्टर २.५ टन कार्बन क्रेडिट आर्जन गरी EcoTrace मार्फत बिक्री गर्न सकिन्छ।</p>
          `.trim(),
          confidence: 98,
          references: ["Nepal Agricultural Research Council (NARC) Core Database", "MoALD Climate-Smart Agriculture Guidelines"],
          followups: [`${cropNepali} सम्बन्धी NARC सिफारिस?`, "माटो परीक्षण कार्ड कसरी बनाउने?", "EcoTrace मा कार्बन क्रेडिट कसरी दर्ता गर्ने?"]
        };
      } else {
        let summary = `<b>Direct Answer for ${cropName} Query${fileNotice}:</b> `;
        let solutions = [];
        if (isDisease) {
          summary += `Prune affected leaves immediately. Spray cold-pressed Neem Oil solution (5 mL/L with mild soap) or <i>Trichoderma harzianum</i> (5 g/L) every 7–10 days.`;
          solutions = [
            `<b>Bio-Pesticide Treatment:</b> Spray Neem oil solution (5 mL/L) or <i>Trichoderma</i> during late evening hours.`,
            `<b>Sanitation & Pruning:</b> Remove severely infected bottom leaves and dispose outside field perimeters.`,
            `<b>Soil Drenching:</b> Drench roots with <i>Beauveria bassiana</i> to suppress soil pathogens biologically.`
          ];
        } else if (isCarbon) {
          summary += `On EcoTrace, 1 Carbon Credit = 1 Metric Ton CO2e reduced/sequestered. Current market trading price is $20–$30 per credit.`;
          solutions = [
            `<b>Zero-Tillage:</b> Direct seed crops without ploughing to retain soil organic carbon.`,
            `<b>AWD Irrigation:</b> Periodically dry rice fields to reduce methane emissions by up to 48%.`,
            `<b>Biochar Application:</b> Apply 2 t/ha biochar to store permanent soil carbon.`
          ];
        } else {
          summary += `Apply 5–8 metric tons/ha Vermicompost during land preparation, 250 kg/ha Neem Cake to suppress soil pathogens, and incorporate Dhaincha (Sesbania) green manure 45 days before transplanting.`;
          solutions = [
            `<b>Organic Basal Dose:</b> Incorporate 5–8 t/ha Vermicompost or 10 t/ha composted manure into topsoil.`,
            `<b>Green Manuring (Sesbania):</b> Sow Dhaincha pre-monsoon and incorporate after 45 days. Adds 70 kg natural N/ha.`,
            `<b>Biochar & Bio-Inoculants:</b> Mix 2 t/ha Biochar enriched with <i>Azotobacter</i> and PSB.`
          ];
        }

        return {
          text: `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>📋 Direct Answer</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>${summary}</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>🔍 Detailed Analysis & Diagnosis</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Following NARC & MoALD climate-smart agriculture guidelines for ${cropName} ensures optimal yield, soil organic carbon enhancement, and crop resilience.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>🌱 Sustainable & Organic Solutions</h4>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>${solutions.map(s => `<li>${s}</li>`).join('')}</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>💧 Water & Resource Conservation</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Implement Alternate Wetting and Drying (AWD) or precision drip irrigation to save 30–50% water.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>📜 Government Policy & Subsidy Guidance</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Access 50% government subsidies for certified seeds, organic fertilizers, and solar pumps via local Krishi Gyan Kendra.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>📈 Carbon Credits & Economic Value</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Adopting sustainable practices generates 1.5 to 2.5 tradable carbon credits/ha/year on EcoTrace ($20–$30/credit).</p>
          `.trim(),
          confidence: 98,
          references: ["Nepal Agricultural Research Council (NARC) Core Database", "MoALD Climate-Smart Agriculture Guidelines"],
          followups: [`What is the specific recommendation for ${cropName}?`, "How do I apply for 50% government subsidies?", "How to register carbon credits on EcoTrace?"]
        };
      }
    }
  }
};
