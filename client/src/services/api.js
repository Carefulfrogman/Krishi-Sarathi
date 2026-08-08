import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://yellow-brook-d9e6.ayushdahal2019.workers.dev/api');

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
      
      const q = (query || "").toLowerCase();
      let fileNotice = fileData ? ` (with attached: ${fileData.name})` : '';

      const langRequestTerms = [
        "give answer in nepali", "give response in nepali", "answer in nepali", "speak in nepali",
        "speak nepali", "in nepali", "nepali language", "nepali ma", "nepali ma vana", "nepali ma bol",
        "nepali ma dinus", "nepali ma deu", "नेपालीमा", "नेपालीमा भन्नुहोस्", "नेपालीमा उत्तर", "नेपालीमा लेख्नुहोस्"
      ];
      const isLangRequest = langRequestTerms.some(term => q.includes(term));
      const isNepali = isLangRequest || language?.toLowerCase().includes("nepali") || language === 'ne';

      if (isLangRequest && !fileData) {
        return {
          text: `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F1F3;&#x1F1F5; हवस्! म नेपालीमा उत्तर दिनेछु।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>नमस्ते! म तपाईंको <b>EcoTrace Farm AI</b> हुँ — कृषि, बालीनाली, रोग, माटो, सिँचाइ र दिगो खेती सम्बन्धी सहायक।</p>
<p class='mb-2 text-slate-700 text-sm'>तपाईंले मलाई सोध्न सक्नुहुन्छ:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 बाली रोग तथा कीरा:</b> "धानको पात पहेँलो भयो — के गर्ने?"</li>
    <li><b>🌱 माटो र मल:</b> "गोलभेडाको माटो सुधार कसरी गर्ने?"</li>
    <li><b>💧 सिँचाइ:</b> "खडेरीमा बाली जोगाउने तरिका?"</li>
    <li><b>📈 कार्बन क्रेडिट:</b> "EcoTrace मा कार्बन क्रेडिट के हो?"</li>
</ul>
<p class='text-slate-600 text-sm'>कृपया आफ्नो कृषि प्रश्न सोध्नुहोस्!</p>
          `.trim(),
          confidence: null,
          references: [],
          followups: ["धानमा लाग्ने मुख्य रोगहरू के हुन्?", "माटो परीक्षण किन गर्नुपर्छ?", "कार्बन क्रेडिट के हो?"]
        };
      }

      const qClean = q.replace(/[^\w\s\u0900-\u097F]/g, "").trim();
      const words = qClean.split(" ").filter(Boolean);
      const greetingTerms = [
        "hello", "hi", "hey", "namaste", "namaskar", "greetings", "good morning", "good evening", "good afternoon",
        "who are you", "how are you", "whats up", "whatsup", "wsp", "k xa", "k chha", "kasto xa", "kasto chha",
        "sanchai", "sanchai hunuhunchha", "k khabar", "के छ", "कस्तो छ", "नमस्ते", "नमस्कार", "हेलो", "हाई",
        "सञ्चै", "सन्चै", "के खबर", "hello k xa", "hi k xa", "namaste bro", "k xa sanchai"
      ];

      let isGreeting = false;
      if (!fileData) {
        if (greetingTerms.includes(qClean)) {
          isGreeting = true;
        } else if (words.length <= 5) {
          isGreeting = greetingTerms.some(term => qClean.includes(term));
        }
      }

      if (isGreeting) {
        if (isNepali) {
          return {
            text: `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F44B; नमस्ते! म EcoTrace Farm AI हुँ।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म तपाईंको कृषि सहायक हुँ — बाली रोग, माटो, सिँचाइ, मल, र दिगो खेती सम्बन्धी प्रश्नहरूमा म सहयोग गर्न सक्छु।</p>
<p class='mb-2 text-slate-700 text-sm'>आज तपाईंलाई के चाहिएको छ? जस्तै:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li>"धानको पातमा दाग देखिन्छ — के हो?"</li>
    <li>"गोलभेडाको माटो सुधार कसरी गर्ने?"</li>
    <li>"कार्बन क्रेडिट कसरी कमाउने?"</li>
</ul>
            `.trim(),
            confidence: null,
            references: [],
            followups: ["धानमा लाग्ने मुख्य रोगहरू के हुन्?", "माटो परीक्षण किन गर्नुपर्छ?", "कार्बन क्रेडिट के हो?"]
          };
        } else {
          return {
            text: `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F44B; Hello! I'm EcoTrace Farm AI.</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>I'm your agricultural assistant — I can help with crop diseases, soil health, irrigation, fertilizers, pest management, and sustainable farming.</p>
<p class='mb-2 text-slate-700 text-sm'>What can I help you with today? For example:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li>"My tomato leaves have brown spots — what could it be?"</li>
    <li>"What are common diseases in rice?"</li>
    <li>"How can I improve my soil health?"</li>
</ul>
            `.trim(),
            confidence: null,
            references: [],
            followups: ["What are common crop diseases in Nepal?", "How do I improve soil health?", "What is carbon farming?"]
          };
        }
      }

      // ── Detect Crop ──
      let cropName = "";
      let cropNepali = "";
      if (q.includes("rice") || q.includes("paddy") || q.includes("basmati") || q.includes("धान") || q.includes("बासमती")) { cropName = "rice"; cropNepali = "धान"; }
      else if (q.includes("tomato") || q.includes("गोलभेडा")) { cropName = "tomato"; cropNepali = "गोलभेडा"; }
      else if (q.includes("potato") || q.includes("आलु")) { cropName = "potato"; cropNepali = "आलु"; }
      else if (q.includes("maize") || q.includes("corn") || q.includes("मकै")) { cropName = "maize"; cropNepali = "मकै"; }
      else if (q.includes("wheat") || q.includes("गहुँ")) { cropName = "wheat"; cropNepali = "गहुँ"; }
      else if (q.includes("apple") || q.includes("स्याउ")) { cropName = "apple"; cropNepali = "स्याउ"; }
      else if (q.includes("mustard") || q.includes("तोरी")) { cropName = "mustard"; cropNepali = "तोरी"; }
      else if (q.includes("cauliflower") || q.includes("cabbage") || q.includes("काउली") || q.includes("बन्दा")) { cropName = "vegetables"; cropNepali = "तरकारी"; }
      else if (q.includes("chilli") || q.includes("pepper") || q.includes("खुर्सानी")) { cropName = "chilli"; cropNepali = "खुर्सानी"; }
      else if (q.includes("lentil") || q.includes("dal") || q.includes("मसुर") || q.includes("दाल")) { cropName = "lentil"; cropNepali = "मसुरो"; }

      // ── Detect topic intent ──
      const agriKeywords = [
        "farm", "farmer", "farming", "crop", "crops", "seed", "seeds", "plant", "plants", "soil", "dirt",
        "fertilizer", "fertilisers", "manure", "compost", "urea", "npk", "pest", "pests", "disease", "diseases",
        "blight", "rot", "yellow", "insect", "insects", "fungus", "fungal", "bug", "bugs", "worm", "worms",
        "water", "irrigation", "drip", "solar", "pump", "rain", "rainfall", "drought", "flood", "weather",
        "climate", "temperature", "hail", "hailstorm", "frost", "carbon", "credit", "credits", "ecotrace",
        "emission", "insurance", "bima", "claim", "policy", "subsidy", "subsidies", "grant", "moald", "narc",
        "krishi", "gyan kendra", "price", "market", "harvest", "yield", "paddy", "rice", "basmati", "wheat",
        "maize", "corn", "tomato", "potato", "apple", "mustard", "cauliflower", "lentil", "dal", "sugarcane",
        "livestock", "cow", "buffalo", "goat", "poultry", "dairy", "organic", "biochar", "neem", "trichoderma",
        "vermicompost", "tillage", "awd", "agroforestry", "green manure", "dhaincha", "mulch", "mulching",
        "blast", "rust", "mildew", "wilt", "aphid", "thrip", "lesion", "spot",
        "कृषि", "खेती", "किसान", "बाली", "माटो", "मल", "बीउ", "रोग", "कीरा", "पात", "पहेलो", "सडेको",
        "सिँचाइ", "पानी", "सौर्य", "पम्प", "मौसम", "असिना", "वर्षा", "खडेरी", "बाढी", "कार्बन", "क्रेडिट",
        "बीमा", "दाबी", "अनुदान", "ऋण", "सरकार", "मन्त्रालय", "बजार", "भाउ", "मूल्य", "उत्पादन", "कटानी",
        "रोपाई", "धान", "मकै", "गहुँ", "गोलभेडा", "आलु", "स्याउ", "तोरी", "काउली", "गाई", "भैंसी", "बाख्रा",
        "प्राङ्गारिक", "भर्मिकम्पोस्ट", "ढैंचा", "फलफूल", "तरकारी", "झुलसा", "ढुसी"
      ];
      const isAgri = agriKeywords.some(kw => q.includes(kw));

      if (!isAgri && !fileData) {
        return {
          text: isNepali
            ? `<h4 class='font-bold text-amber-700 flex items-center gap-2 mb-3 text-base'>&#x26A0;&#xFE0F; यो प्रश्न कृषिसँग सम्बन्धित देखिएन।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म केवल कृषि, बालीनाली, माटो, रोग, सिँचाइ, दिगो खेती र कार्बन क्रेडिट सम्बन्धी प्रश्नहरूमा सहयोग गर्न सक्छु।</p>
<p class='text-slate-600 text-sm'>जस्तै: <i>"धानमा कस्तो रोग लाग्छ?"</i> वा <i>"माटो परीक्षण कसरी गर्ने?"</i></p>`
            : `<h4 class='font-bold text-amber-700 flex items-center gap-2 mb-3 text-base'>&#x26A0;&#xFE0F; That question doesn't appear to be about farming.</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>I can help with crops, soil, diseases, pests, irrigation, fertilizers, and sustainable farming.</p>
<p class='text-slate-600 text-sm'>Try: <i>"What diseases affect tomatoes?"</i> or <i>"How do I improve my soil?"</i></p>`,
          confidence: null,
          references: [],
          followups: isNepali
            ? ["धानमा लाग्ने मुख्य रोगहरू के हुन्?", "माटो परीक्षण किन गर्नुपर्छ?", "कार्बन क्रेडिट के हो?"]
            : ["What are common crop diseases in Nepal?", "How do I improve soil health?", "What is carbon farming?"]
        };
      }

      const isDisease = ["disease","pest","blight","spot","yellow","rot","bug","worm","rust","mold","fungus","aphid","thrip","blast","burn","curl","lesion","mildew","wilt","leaf","रोग","कीरा","पात","पहेँलो","झुलसा","ढुसी","सडेको"].some(w => q.includes(w));
      const isFertilizer = ["fertilizer","fertiliser","manure","compost","npk","urea","soil","nutrient","organic","nitrogen","phosphorus","potassium","ph","acidic","alkaline","soil test","मल","माटो","यूरिया","खाद","पोषण"].some(w => q.includes(w));
      const isCarbon = ["carbon","credit","sequestration","emission","offset","methane","co2","zero tillage","awd","agroforestry","कार्बन","क्रेडिट","उत्सर्जन","जलवायु"].some(w => q.includes(w));
      const isIrrigation = ["water","irrigation","drip","rain","drought","solar","pump","flood","waterlogging","monsoon","खडेरी","सिँचाइ","पानी","सौर्य","बाढी","थोपा"].some(w => q.includes(w));
      const isHarvest = ["harvest","yield","production","season","sow","transplant","nursery","काट्ने","उत्पादन","रोप्ने","बुवाई","पाक्ने"].some(w => q.includes(w));
      const isGeneralDiseaseInfo = ["common disease","types of disease","tell me about disease","what disease","disease list","about disease","कस्ता रोग","सामान्य रोग","रोगहरू के"].some(p => q.includes(p));

      const cropDisplay = cropName || "your crop";
      const cropDisplayNe = cropNepali || "तपाईंको बाली";

      // ── GENERAL DISEASE EDUCATION ──
      if ((isGeneralDiseaseInfo || isDisease) && !cropName && !fileData) {
        const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F50D; Common Crop Diseases — Educational Overview</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>&#x26A0;&#xFE0F; Note:</b> This is general educational information — not a diagnosis of your specific crop.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🌾 Rice</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Blast:</b> Diamond-shaped grey/brown lesions on leaves. Favoured by high humidity and excess nitrogen.</li>
  <li><b>Bacterial Leaf Blight:</b> Yellowing from the leaf edge inward. Spreads in warm, humid conditions.</li>
  <li><b>Sheath Blight:</b> Water-soaked lesions on leaf sheath. Favoured by dense planting.</li>
</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🍅 Tomato</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Early Blight:</b> Dark concentric ring lesions on older leaves. Warm, humid conditions.</li>
  <li><b>Late Blight:</b> Water-soaked lesions spreading rapidly in cool, wet conditions.</li>
  <li><b>Bacterial Wilt:</b> Sudden wilting of the whole plant despite adequate water.</li>
</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🌽 Maize &amp; 🥔 Potato</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Maize Leaf Blight:</b> Long grey-green lesions on leaves.</li>
  <li><b>Potato Late Blight:</b> Similar to tomato late blight — spreads in cool, wet weather.</li>
</ul>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>&#x1F4A1; Important:</b> Yellow leaves, spots, or wilting are not automatically disease signs. They can also result from nutrient deficiency, waterlogging, drought, or root damage.</p>
<p class='text-slate-600 text-sm'>Tell me your <b>specific crop, plant age, and exactly what you see</b> — or upload a photo — for more targeted guidance.</p>`;

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F50D; सामान्य बाली रोगहरू — शैक्षिक जानकारी</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>⚠️ नोट:</b> तलको जानकारी शैक्षिक उद्देश्यका लागि हो। यो तपाईंको बालीको रोग निदान होइन।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>🌾 धान</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>झुलसा (Blast):</b> पातमा हीरा आकारका खैरो-सेतो धब्बा। बादलयुक्त मौसम र अधिक नाइट्रोजनमा बढ्छ।</li>
  <li><b>जीवाणुजन्य पातको झुलसा:</b> पातको किनारबाट पहेँलो हुँदै सुक्छ।</li>
  <li><b>खोलको झुलसा:</b> धानको खोलमा पानीजस्तो दाग। घना लगाइमा बढ्छ।</li>
</ul>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>🍅 गोलभेडा</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>अगाडि लाग्ने डढुवा (Early Blight):</b> पुरानो पातमा गाढा गोलो दाग, रिंग बनाउँछ।</li>
  <li><b>पछाडि लाग्ने डढुवा (Late Blight):</b> पानी-सोखिएजस्तो दाग, चिसो ओसिलो मौसममा छिटो फैलिन्छ।</li>
  <li><b>जीवाणुजन्य ओइलाइ:</b> बोट अचानक ओइलाउँछ।</li>
</ul>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>💡 महत्त्वपूर्ण:</b> पहेँलो पात, दाग वा ओइलाइ सधैं रोगको संकेत होइन — पोषण कमी, पानी समस्या वा जडान क्षतिले पनि हुन सक्छ।</p>
<p class='text-slate-600 text-sm'>तपाईंको <b>बालीको नाम, बोटको उमेर र प्रभावित भागको तस्बिर</b> पठाउनुहोस् — थप सटीक सहयोगका लागि।</p>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
          followups: isNepali
            ? ["धानको झुलसा र जीवाणु झुलसामा के फरक छ?", "गोलभेडाको अगाडि र पछाडि डढुवामा के फरक छ?", "तस्बिर कसरी पठाउने?"]
            : ["How do I tell early blight from late blight in tomatoes?", "What causes yellow leaves in rice?", "How do I upload a crop photo?"]
        };
      }

      // ── SPECIFIC SYMPTOM — ask for more detail ──
      if (isDisease) {
        let en = '';
        if (cropName === 'maize') {
          en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F33D; Maize — Diseases, Solutions &amp; Fertilizer</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Here is an educational overview for <b>Maize (Corn)</b>${fileNotice}:</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🦠 Common Maize Diseases &amp; Symptoms</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Northern Corn Leaf Blight:</b> Long, cigar-shaped grey-green lesions on leaves. Favored by wet, humid conditions.</li>
  <li><b>Common Rust:</b> Small, oval, reddish-brown pustules on both leaf surfaces.</li>
  <li><b>Fall Armyworm (Pest):</b> Ragged holes in leaves, whorl damage, and frass (caterpillar waste).</li>
  <li><b>Stalk &amp; Ear Rot:</b> Premature wilting, rotting at stalk base, or moldy cob.</li>
</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🌿 Safe Management &amp; Prevention</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Crop Rotation:</b> Rotate maize with legumes (beans, lentils, soybean) to break disease cycles.</li>
  <li><b>Resistant Varieties:</b> Plant NARC-recommended disease-resistant maize seeds.</li>
  <li><b>Field Sanitation:</b> Remove or plow under infected crop residue after harvest.</li>
  <li><b>Pest Monitoring:</b> Check leaf whorls early for caterpillars; use yellow sticky traps and safe IPM controls.</li>
</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🧪 Fertilizer &amp; Soil Guidelines for Maize</h4>
<p class='mb-2 text-slate-700 text-sm'>Maize is a heavy nutrient feeder, especially for Nitrogen and Phosphorus:</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Organic Basal Dose:</b> Apply well-decomposed Farmyard Manure (FYM) or Vermicompost during land preparation to build soil organic carbon.</li>
  <li><b>Split Nitrogen Application:</b> Split Nitrogen into 2-3 doses (at planting, knee-high stage, and tasseling) to prevent nutrient leaching.</li>
  <li><b>Micronutrients:</b> Zinc deficiency causes white/yellow bands on young maize leaves — get a soil test to confirm micro-nutrient needs.</li>
</ul>
<p class='text-slate-600 text-sm'><b>💡 Tip:</b> For a specific diagnosis of your current crop condition, tell me the plant's age and what symptoms you see, or upload a photo.</p>`;
        } else {
          en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F50D; ${cropDisplay.charAt(0).toUpperCase()+cropDisplay.slice(1)} — Symptom Analysis${fileNotice}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Based on your description, there are several possible causes. Let me help you narrow it down.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🔎 Possible causes</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Fungal disease:</b> Often causes distinct spots, lesions, or powdery growth on leaves.</li>
  <li><b>Bacterial disease:</b> Commonly produces water-soaked or yellowing areas along the leaf.</li>
  <li><b>Nutrient deficiency:</b> Older leaves yellowing first suggests nitrogen; newer leaves suggest other deficiencies.</li>
  <li><b>Water stress:</b> Both waterlogging and drought can cause yellowing and wilting.</li>
  <li><b>Pest damage:</b> Look for holes, insect presence, or sticky residue on leaves.</li>
</ul>
<p class='mb-2 text-slate-700 text-sm'><b>To help narrow this down, please tell me:</b></p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li>Which crop, and how old is the plant?</li>
  <li>Are older leaves or newer leaves affected first?</li>
  <li>Is the soil waterlogged, well-drained, or dry?</li>
  <li>Can you attach a clear photo of the affected plant part?</li>
</ul>`;
        }

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F50D; ${cropDisplayNe} — रोग/कीरा विश्लेषण${fileNotice}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>तपाईंको विवरणबाट केही कारणहरू सम्भव छन् — तर सटीक निदान गर्न थप जानकारी आवश्यक छ।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>🔎 सम्भावित कारणहरू</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>ढुसीजन्य रोग:</b> प्राय: दाग, थाप्ला वा पातको किनारमा हुन्छ।</li>
  <li><b>जीवाणुजन्य रोग:</b> पानी-सोखिएजस्तो वा पहेँलो-हरियो क्षेत्र।</li>
  <li><b>पोषण तत्वको कमी:</b> पुरानो पात पहेँलो हुनु नाइट्रोजन कमी, नयाँ पात प्रभावित हुनु अन्य कमीको संकेत।</li>
  <li><b>जल समस्या:</b> अत्यधिक पानी वा खडेरीले पनि ओइलाइ र पहेँलो पात हुन्छ।</li>
  <li><b>कीराले गर्दा:</b> प्वाल, चुस्नुको निसान वा सुकेका डाँठ।</li>
</ul>
<p class='mb-2 text-slate-700 text-sm'><b>निदानका लागि मलाई बताउनुहोस्:</b></p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li>कुन बाली हो र बोट कति पुरानो छ?</li>
  <li>पहेँलो वा दाग पुरानो पातमा पहिले आयो कि नयाँ पातमा?</li>
  <li>खेतमा पानी जम्छ कि माटो सुक्खा छ?</li>
  <li>सम्भव भए प्रभावित भागको तस्बिर पठाउनुहोस्।</li>
</ul>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
          followups: isNepali
            ? ["तस्बिर कसरी पठाउने?", "पहेँलो पातको कारण के हो?", "धानमा लाग्ने रोगहरू के हुन्?"]
            : ["How do I upload a photo?", "What causes yellow leaves?", "What are common tomato diseases?"]
        };
      }

      // ── FERTILIZER / SOIL ──
      if (isFertilizer) {
        const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F331; Soil &amp; Fertilizer — General Principles</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>Soil testing</b> is the most important first step. Without knowing your soil's pH and nutrient levels, specific fertilizer recommendations may not suit your farm.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🧪 What soil testing tells you</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>pH:</b> Acidic soil (below 5.5) or alkaline soil (above 7.5) limits nutrient uptake, even if fertilizer is applied.</li>
  <li><b>NPK levels:</b> Nitrogen, Phosphorus, and Potassium status.</li>
  <li><b>Organic matter:</b> Affects water retention, nutrient availability, and soil life.</li>
</ul>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>📋 General guidance</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li>Get your soil tested before applying large amounts of fertilizer.</li>
  <li>Organic matter (compost, farmyard manure) improves soil structure and nutrient availability.</li>
  <li>Green manures (like Dhaincha/Sesbania) naturally add nitrogen.</li>
  <li>For specific crop fertilizer rates, contact your local Agriculture Knowledge Centre.</li>
</ul>
<p class='text-slate-600 text-sm'>Tell me your crop and specific problem for more targeted guidance.</p>`;

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F331; माटो र मल — सामान्य सिद्धान्तहरू</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>माटोको उर्वराशक्ति बुझ्न <b>माटो परीक्षण</b> सबैभन्दा महत्त्वपूर्ण कदम हो। परीक्षण बिना सटीक मात्रा भन्न गाह्रो छ।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>🧪 माटो परीक्षणले के देखाउँछ?</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>pH मान:</b> अम्लीय वा क्षारीय माटोमा पोषण तत्व कम पाइन्छ।</li>
  <li><b>NPK स्तर:</b> नाइट्रोजन, फस्फोरस र पोटासियमको मात्रा।</li>
  <li><b>प्राङ्गारिक पदार्थ:</b> माटोको जीवन र पानी-थाम्ने क्षमता।</li>
</ul>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>📋 सामान्य सुझावहरू</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li>माटो परीक्षण गरी आफ्नो खेतको अवस्था बुझ्नुहोस्।</li>
  <li>प्राङ्गारिक मल (गोबर, कम्पोस्ट) माटोको संरचना सुधार गर्छ।</li>
  <li>हरियो मल (ढैंचा) प्रयोगले प्राकृतिक नाइट्रोजन बढ्छ।</li>
  <li>सटीक मात्राका लागि नजिकको <b>कृषि ज्ञान केन्द्र</b>मा सम्पर्क गर्नुहोस्।</li>
</ul>
<p class='text-slate-600 text-sm'>तपाईंको बाली र माटोको अवस्था बताउनुभयो भने थप सटीक सुझाव दिन सक्छु।</p>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
          followups: isNepali
            ? ["माटो परीक्षण कहाँ गर्ने?", "धानको लागि कुन मल राम्रो?", "हरियो मल के हो?"]
            : ["Where can I get soil tested?", "What does organic matter do for soil?", "What is green manure?"]
        };
      }

      // ── CARBON CREDITS ──
      if (isCarbon) {
        const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F4C8; Carbon Credits — EcoTrace</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Carbon credits represent the <b>verified value</b> of reducing CO2 emissions or increasing carbon storage on your farm.</p>
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-2 text-sm'>🌱 How farms can generate carbon credits</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Zero-Tillage:</b> Reduces soil disturbance, helping retain soil organic carbon.</li>
  <li><b>AWD (Alternate Wetting and Drying):</b> Reduces methane emissions from paddy fields.</li>
  <li><b>Agroforestry:</b> Trees store carbon long-term on farm boundaries.</li>
  <li><b>Organic matter management:</b> Builds soil carbon over time.</li>
</ul>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>Important:</b> Actual carbon credit generation depends on your specific farm data, the applicable methodology, measurement, monitoring, and verification — simple estimates are not reliable.</p>
<p class='text-slate-600 text-sm'>Register your farm on EcoTrace to learn more about your eligibility.</p>`;

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F4C8; कार्बन क्रेडिट — EcoTrace</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>कार्बन क्रेडिट भनेको खेतमा CO2 उत्सर्जन घटाउने वा कार्बन भण्डारण गर्ने कार्यको <b>प्रमाणित मूल्यांकन</b> हो।</p>
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-sm'>🌱 कार्बन क्रेडिट कसरी उत्पन्न हुन्छ?</h4>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>शून्य जोताई:</b> माटो नजोती रोप्दा माटोभित्रको कार्बन जोगिन्छ।</li>
  <li><b>AWD:</b> धानखेतमा मिथेन उत्सर्जन घटाउँछ।</li>
  <li><b>वृक्षारोपण:</b> रूखहरूले दीर्घकालीन कार्बन भण्डारण गर्छन्।</li>
  <li><b>प्राङ्गारिक खेती:</b> माटोमा कार्बन सञ्चय बढाउँछ।</li>
</ul>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'><b>महत्त्वपूर्ण:</b> वास्तविक कार्बन क्रेडिट मूल्यांकन खेतको विशेष डेटा, प्रमाणिकरण विधि र परियोजनाका नियमहरूमा भर पर्छ — सरल अनुमान गाह्रो हुन्छ।</p>
<p class='text-slate-600 text-sm'>EcoTrace मा आफ्नो फार्म दर्ता गरेर आफ्नो योग्यता जान्नुहोस्।</p>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI"],
          followups: isNepali
            ? ["EcoTrace मा फार्म कसरी दर्ता गर्ने?", "AWD प्रविधि के हो?", "शून्य जोताईका फाइदाहरू?"]
            : ["How do I register on EcoTrace?", "What is AWD irrigation?", "What is zero-tillage farming?"]
        };
      }

      // ── IRRIGATION ──
      if (isIrrigation) {
        const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F4A7; Irrigation &amp; Water Management</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>The best irrigation method depends on your crop type, soil, and available water source.</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Drip Irrigation:</b> Delivers water directly to plant roots — suitable for vegetables and fruit crops.</li>
  <li><b>Sprinkler:</b> Useful for larger field crops.</li>
  <li><b>AWD (Alternate Wetting and Drying):</b> A water-saving method for paddy fields that also reduces methane emissions.</li>
  <li><b>Solar Pumps:</b> Useful where electricity is unavailable.</li>
</ul>
<p class='text-slate-600 text-sm'>For subsidy information, contact your <b>local Agriculture Knowledge Centre or municipal agriculture section</b> to confirm currently available programs.</p>`;

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F4A7; सिँचाइ र जल व्यवस्थापन</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>बालीको प्रकार र माटोको अवस्था अनुसार सिँचाइ विधि फरक हुन्छ।</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>थोपा सिँचाइ (Drip):</b> तरकारी र फलफूलका लागि — पानी सीधा जरामा जान्छ।</li>
  <li><b>फोहोरा सिँचाइ (Sprinkler):</b> खुला खेतका लागि।</li>
  <li><b>AWD:</b> धान खेतमा पानी बचाउने र मिथेन घटाउने तरिका।</li>
  <li><b>सौर्य पम्प:</b> बिजुली नभएको ठाउँमा।</li>
</ul>
<p class='text-slate-600 text-sm'>सरकारी अनुदानका लागि नजिकको <b>कृषि ज्ञान केन्द्र वा स्थानीय तहको कृषि शाखा</b>मा सम्पर्क गर्नुहोस् — हाल उपलब्ध कार्यक्रम पुष्टि गर्न।</p>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
          followups: isNepali
            ? ["AWD सिँचाइ विधि के हो?", "थोपा सिँचाइका फाइदाहरू?", "खडेरीमा बाली कसरी जोगाउने?"]
            : ["What is AWD irrigation?", "How does drip irrigation work?", "How do I protect crops from drought?"]
        };
      }

      // ── HARVEST / PLANTING ──
      if (isHarvest) {
        const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F4CB; ${cropDisplay.charAt(0).toUpperCase()+cropDisplay.slice(1)} — Planting &amp; Harvest</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Timing depends on crop, location, and season. The following is general guidance for Nepal.</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Rice:</b> Nursery in June. Transplanting in July. Harvest October–November.</li>
  <li><b>Wheat:</b> Sowing November–December. Harvest March–April.</li>
  <li><b>Maize:</b> Spring (March–April) and Monsoon (June–July).</li>
  <li><b>Tomato:</b> Spring (Feb–March) and Autumn (Aug–Sep).</li>
</ul>
<p class='text-slate-600 text-sm'>For timing specific to your district and variety, contact your <b>local Agriculture Knowledge Centre</b>.</p>`;

        const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F4CB; ${cropDisplayNe} — रोपाई र कटानी</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>रोपाई र कटानीको सही समय बाली, स्थान र मौसममा भर पर्छ।</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>धान:</b> नर्सरी असार, रोपाई साउन, cutानी कार्तिक–मंसिर।</li>
  <li><b>गहुँ:</b> बुवाई मंसिर–पुस, कटानी फागुन–चैत।</li>
  <li><b>मकै:</b> वसन्त (चैत–वैशाख) र मनसुन (असार–साउन)।</li>
  <li><b>गोलभेडा:</b> वसन्त (फागुन–चैत) र शरद (साउन–भाद्र)।</li>
</ul>
<p class='text-slate-600 text-sm'>तपाईंको जिल्ला र बालीका लागि सटीक सुझावका लागि <b>स्थानीय कृषि ज्ञान केन्द्र</b>मा सम्पर्क गर्नुहोस्।</p>`;

        return {
          text: isNepali ? ne : en,
          confidence: null,
          references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
          followups: isNepali
            ? ["धान कटानीको संकेत के हो?", "गोलभेडा कहिले रोप्ने?", "अन्न भण्डारण कसरी गर्ने?"]
            : ["How do I know when rice is ready to harvest?", "When is the best time to plant tomatoes?", "How to store grain after harvest?"]
        };
      }

      // ── DEFAULT ──
      const en = `
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F4CB; Farming Guidance — ${cropDisplay.charAt(0).toUpperCase()+cropDisplay.slice(1)}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Here is some general guidance${fileNotice}:</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>Soil testing:</b> Know your soil's pH and nutrient status before applying fertilizers.</li>
  <li><b>Quality seed:</b> Use healthy, disease-free seed from a reliable source.</li>
  <li><b>Regular monitoring:</b> Look for early signs of disease, pests, or nutrient problems.</li>
  <li><b>Water management:</b> Avoid both waterlogging and drought stress.</li>
</ul>
<p class='text-slate-600 text-sm'>Tell me your <b>specific crop, the problem you're facing, and the current condition of your plants</b> for more targeted advice.</p>`;

      const ne = `
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F4CB; कृषि सहायता — ${cropDisplayNe}</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>तपाईंको प्रश्न${fileNotice} सम्बन्धी सामान्य जानकारी:</p>
<ul class='list-disc pl-5 space-y-1.5 mb-4 text-slate-700 text-sm'>
  <li><b>माटो परीक्षण:</b> पहिले माटोको pH र पोषण तत्व जाँच्नुहोस्।</li>
  <li><b>गुणस्तरीय बीउ:</b> रोग प्रतिरोधी वा स्थानीय परीक्षण भएका जातका बीउ छान्नुहोस्।</li>
  <li><b>नियमित निगरानी:</b> रोग, कीरा वा पोषण समस्याका संकेत हेर्नुहोस्।</li>
  <li><b>जल व्यवस्थापन:</b> खेतमा न अत्यधिक पानी न सुख्खा हुन दिनुहोस्।</li>
</ul>
<p class='text-slate-600 text-sm'>थप सटीक सहयोगका लागि आफ्नो <b>बाली, समस्या र खेतको अवस्था</b> बताउनुहोस्।</p>`;

      return {
        text: isNepali ? ne : en,
        confidence: null,
        references: ["EcoTrace Farm AI Agricultural Knowledge Base"],
        followups: isNepali
          ? ["धानमा लाग्ने रोगहरू के हुन्?", "माटो परीक्षण कहाँ गर्ने?", "कार्बन क्रेडिट के हो?"]
          : ["What are common crop diseases?", "How do I improve soil health?", "What is carbon farming?"]
      };
    }
  }
};
