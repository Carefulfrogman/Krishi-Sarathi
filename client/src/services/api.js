import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1500,
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
  askAiAssistant: async (query, language, context) => {
    // Using a separate instance or inline config for longer timeout (30 seconds)
    const response = await axios.post(
      `${API_BASE}/ai/chat`,
      { query, language, context },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 
      }
    );
    return response.data;
  }
};
