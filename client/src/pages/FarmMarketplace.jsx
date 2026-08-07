import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

/* ═══════════════════════════════════════════════════════════
   NEPALI HAAT BAZAAR — FARM MARKETPLACE
   With AI Price Intelligence, Market Benchmarking & Buyer Digital Purchase Certificates
   ═══════════════════════════════════════════════════════════ */

// ── Farmer Profiles ──────────────────────────────────────
const farmerProfiles = {
  'f-001': { name: 'Ram Bahadur Thapa', farm: 'थापा अर्गानिक कृषि फार्म', location: 'Bharatpur, Chitwan', province: 'Bagmati', district: 'Chitwan', municipality: 'Bharatpur', score: 94, area: '8.2 Hectares', soil: 'Alluvial Loam', crops: 'Basmati Rice, Maize, Mustard', photo: '👨‍🌾' },
  'f-002': { name: 'Sita Kumari Gurung', farm: 'गुरुङ चिया बगान', location: 'Ilam Municipality, Ilam', province: 'Province 1', district: 'Ilam', municipality: 'Ilam Municipality', score: 97, area: '12.0 Hectares', soil: 'Laterite Red', crops: 'Orthodox Tea, Cardamom, Ginger', photo: '👩‍🌾' },
  'f-003': { name: 'Krishna Prasad Poudel', farm: 'पौडेल फलफूल बगैंचा', location: 'Marpha, Mustang', province: 'Gandaki', district: 'Mustang', municipality: 'Marpha', score: 91, area: '15.5 Hectares', soil: 'Sandy Loam', crops: 'Apples, Buckwheat, Timur Pepper', photo: '👨‍🌾' },
  'f-004': { name: 'Laxmi Devi Yadav', farm: 'यादव कृषि सहकारी', location: 'Janakpur, Dhanusha', province: 'Madhesh', district: 'Dhanusha', municipality: 'Janakpur', score: 88, area: '22.0 Hectares', soil: 'Clay Loam', crops: 'Rice, Lentils, Wheat, Sugarcane', photo: '👩‍🌾' },
  'f-005': { name: 'Pemba Sherpa', farm: 'शेर्पा हिमाली मह', location: 'Namche, Solukhumbu', province: 'Province 1', district: 'Solukhumbu', municipality: 'Namche', score: 96, area: '3.0 Hectares', soil: 'Mountain Humus', crops: 'Wild Honey, Yarsagumba, Herbs', photo: '👨‍🌾' },
  'f-006': { name: 'Sarita Bhandari', farm: 'भण्डारी मसला खेती', location: 'Pokhara, Kaski', province: 'Gandaki', district: 'Kaski', municipality: 'Pokhara', score: 92, area: '5.8 Hectares', soil: 'Red Laterite', crops: 'Turmeric, Ginger, Cardamom, Coffee', photo: '👩‍🌾' },
  'f-007': { name: 'Gopal Khadka', farm: 'खड्का उपत्यका फार्म', location: 'Surkhet, Surkhet', province: 'Karnali', district: 'Surkhet', municipality: 'Birendranagar', score: 85, area: '18.0 Hectares', soil: 'Silty Clay', crops: 'Millet, Maize, Oranges, Lentils', photo: '👨‍🌾' },
  'f-008': { name: 'Durga Bhatta', farm: 'भट्ट जैविक कृषि', location: 'Dhangadhi, Kailali', province: 'Sudurpashchim', district: 'Kailali', municipality: 'Dhangadhi', score: 89, area: '14.0 Hectares', soil: 'Sandy Alluvial', crops: 'Rice, Mustard, Vegetables, Mango', photo: '👩‍🌾' },
};

// ── Product Catalog (With AI Price Benchmarking) ─────────
const productCatalog = [
  { id: 1,  name: 'Jethobudo Basmati Rice', nameNe: 'जेठोबुढो बासमती चामल', category: 'grain', emoji: '🌾', farmerId: 'f-001', priceNPR: 180, marketAvgNPR: 210, badge: 'Best Value', priceExplanation: '14% lower than market average due to direct cooperative distribution. Premium pricing justified by 100% vermicompost & zero chemical nitrogen.', unit: 'kg', stock: 850, harvestDate: '2026-08-05', organic: true, qrVerified: true, description: 'Premium aromatic long-grain Basmati rice from Chitwan lowlands, grown with vermicompost.' },
  { id: 2,  name: 'Ilam Orthodox Tea', nameNe: 'इलाम अर्थोडक्स चिया', category: 'beverage', emoji: '🍵', farmerId: 'f-002', priceNPR: 1200, marketAvgNPR: 1100, badge: 'Premium Sustainable Product', priceExplanation: '9% above market average due to verified single-origin altitude harvesting (1,800m) and carbon net-negative soil biochar practices.', unit: '500g box', stock: 120, harvestDate: '2026-08-06', organic: true, qrVerified: true, description: 'Hand-rolled first flush tea from the misty hills of Ilam, zero pesticide certification.' },
  { id: 3,  name: 'Mustang Apple', nameNe: 'मुस्ताङ स्याउ', category: 'fruit', emoji: '🍎', farmerId: 'f-003', priceNPR: 320, marketAvgNPR: 360, badge: 'Best Value', priceExplanation: '11% below market price owing to direct mountain transport. Crisp high-altitude quality verified via satellite canopy health.', unit: 'kg', stock: 400, harvestDate: '2026-08-04', organic: true, qrVerified: true, description: 'Crisp high-altitude apples from Marpha orchards, naturally ripened at 2,700m elevation.' },
  { id: 4,  name: 'Dhanusha Red Lentil', nameNe: 'धनुषा मसुरो दाल', category: 'grain', emoji: '🫘', farmerId: 'f-004', priceNPR: 210, marketAvgNPR: 220, badge: 'Standard Verified', priceExplanation: 'Matched with Kalimati wholesale market rates. Certified zero adulteration via QR traceability.', unit: 'kg', stock: 1200, harvestDate: '2026-08-03', organic: false, qrVerified: true, description: 'Split red lentils from the fertile Madhesh plains, staple Nepali dal ingredient.' },
  { id: 5,  name: 'Wild Himalayan Honey', nameNe: 'हिमाली जंगली मह', category: 'specialty', emoji: '🍯', farmerId: 'f-005', priceNPR: 2800, marketAvgNPR: 2500, badge: 'Premium Sustainable Product', priceExplanation: '12% premium reflects dangerous high-cliff Sherpa harvesting and wild medicinal flora foraging in Solukhumbu.', unit: 'kg', stock: 25, harvestDate: '2026-08-01', organic: true, qrVerified: true, description: 'Raw cliff honey harvested by Sherpa beekeepers from Solukhumbu wildflower cliffs.' },
  { id: 6,  name: 'Kaski Organic Turmeric', nameNe: 'कास्की जैविक बेसार', category: 'spice', emoji: '🟡', farmerId: 'f-006', priceNPR: 450, marketAvgNPR: 500, badge: 'Best Value', priceExplanation: '10% below retail store prices. High-curcumin Lakadong variety tested at 6.8% active curcumin.', unit: 'kg', stock: 300, harvestDate: '2026-08-06', organic: true, qrVerified: true, description: 'High-curcumin Lakadong variety turmeric, sun-dried and hand-ground in Pokhara.' },
];

const provinces = [
  { value: 'all', label: 'All Provinces (सबै प्रदेश)' },
  { value: 'Province 1', label: 'Province 1 (कोशी)' },
  { value: 'Madhesh', label: 'Madhesh (मधेश)' },
  { value: 'Bagmati', label: 'Bagmati (बागमती)' },
  { value: 'Gandaki', label: 'Gandaki (गण्डकी)' },
  { value: 'Lumbini', label: 'Lumbini (लुम्बिनी)' },
  { value: 'Karnali', label: 'Karnali (कर्णाली)' },
  { value: 'Sudurpashchim', label: 'Sudurpashchim (सुदूरपश्चिम)' },
];

function daysSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function freshnessLabel(days) {
  if (days <= 1) return { text: 'Harvested Today', color: 'text-primary-green', bg: 'bg-accent-green/20' };
  if (days <= 3) return { text: `${days} days ago`, color: 'text-secondary-green', bg: 'bg-secondary-green/20' };
  return { text: `${days} days ago`, color: 'text-sunrise', bg: 'bg-sunrise/20' };
}

export const FarmMarketplace = () => {
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [orderCertificate, setOrderCertificate] = useState(null);
  const [explainPriceModal, setExplainPriceModal] = useState(null);
  const [farmerModal, setFarmerModal] = useState(null);

  const filtered = useMemo(() => {
    return productCatalog.filter((p) => {
      const farmer = farmerProfiles[p.farmerId];
      const q = search.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || farmer.name.toLowerCase().includes(q) || farmer.district.toLowerCase().includes(q);
      const matchesProvince = province === 'all' || farmer.province === province;
      const matchesOrganic = !organicOnly || p.organic;
      const matchesPrice = p.priceNPR <= maxPrice;
      return matchesSearch && matchesProvince && matchesOrganic && matchesPrice;
    });
  }, [search, province, organicOnly, maxPrice]);

  const ProductCard = ({ product }) => {
    const farmer = farmerProfiles[product.farmerId];
    const days = daysSince(product.harvestDate);
    const fresh = freshnessLabel(days);
    const priceDiff = Math.round(((product.priceNPR - product.marketAvgNPR) / product.marketAvgNPR) * 100);

    return (
      <div className="bg-white border border-soil-brown/10 rounded-3xl p-5 flex flex-col justify-between hover:border-secondary-green/40 transition-all duration-300 shadow-sm space-y-4">
        <div>
          {/* Badges & QR Button */}
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl leading-none">{product.emoji}</span>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${product.badge === 'Best Value' ? 'bg-accent-green/20 text-primary-green border-accent-green/30' : 'bg-golden-harvest/20 text-sunrise border-golden-harvest/30'}`}>
                {product.badge}
              </span>
              <Link to="/qr" className="text-[9px] font-bold text-secondary-green hover:underline flex items-center gap-1">
                <span>📱 View QR</span>
              </Link>
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-charcoal leading-snug">{product.name}</h3>
          <p className="text-[10px] text-mountain-gray font-bold mt-0.5">{product.nameNe}</p>
          <p className="text-xs text-soil-brown leading-relaxed mt-2 line-clamp-2">{product.description}</p>

          <button onClick={() => setFarmerModal(farmer)} className="mt-3 flex items-center gap-2 text-left">
            <span className="text-lg">{farmer.photo}</span>
            <div>
              <span className="text-[11px] font-bold text-primary-green hover:underline">{farmer.name}</span>
              <span className="block text-[10px] text-mountain-gray">{farmer.district}</span>
            </div>
          </button>
        </div>

        <div className="pt-3 border-t border-soil-brown/10 space-y-3">
          {/* Price & AI Intelligence Benchmarking */}
          <div className="bg-bg-cream p-3 rounded-2xl border border-soil-brown/10 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-mountain-gray font-medium">Price:</span>
              <span className="font-black text-sunrise text-sm">रू {product.priceNPR} / {product.unit}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-mountain-gray">Market Avg: रू {product.marketAvgNPR}</span>
              <span className={`font-bold ${priceDiff <= 0 ? 'text-primary-green' : 'text-sunrise'}`}>
                {priceDiff <= 0 ? `${priceDiff}% (Cheaper)` : `+${priceDiff}% (Premium)`}
              </span>
            </div>
            <button
              onClick={() => setExplainPriceModal(product)}
              className="text-[9.5px] font-bold text-secondary-green hover:underline block w-full text-right pt-0.5"
            >
              💡 Why this price? (AI Analysis)
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-mountain-gray font-bold">Stock: {product.stock} {product.unit}</span>
            <span className={`${fresh.bg} ${fresh.color} px-2 py-0.5 rounded font-bold`}>
              🕐 {fresh.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link to="/qr" className="py-2.5 bg-bg-cream hover:bg-soil-brown/10 text-charcoal text-xs font-bold rounded-xl text-center transition border border-soil-brown/20">
              QR Passport
            </Link>
            <button
              onClick={() => { setCheckoutProduct(product); setCheckoutQty(1); }}
              className="py-2.5 bg-primary-green hover:bg-secondary-green text-white text-xs font-black rounded-xl transition shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-cream text-charcoal font-sans relative">
      {/* Top Header */}
      <header className="border-b border-soil-brown/20 bg-bg-cream/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-primary-green font-extrabold text-xl">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-soil-brown/20 flex items-center justify-center shadow-sm">
              <img src="/logo2.png" alt="Krishi Saarathi Logo" className="w-full h-full object-cover" />
            </div>
            <span>Krishi <span className="text-charcoal">Saarathi</span> Market</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-mountain-gray hover:text-primary-green text-xs font-semibold">Home</Link>
            <Link to="/login" className="px-4 py-2 border border-soil-brown/20 bg-white text-charcoal hover:bg-bg-cream text-xs font-bold rounded-xl shadow-sm">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 py-10 text-center space-y-2">
        <span className="px-3 py-1 bg-golden-harvest/10 text-sunrise text-[10px] font-black uppercase tracking-widest rounded-full border border-golden-harvest/20">
          🇳🇵 Direct Farm-to-Buyer Marketplace
        </span>
        <h1 className="text-3xl font-black text-charcoal">AI-Priced & QR-Verified Produce Market</h1>
        <p className="text-xs text-soil-brown max-w-lg mx-auto">
          Compare market averages, inspect satellite NDVI proof, and purchase directly from verified Nepalese farms.
        </p>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ═══ AI PRICE EXPLANATION MODAL ═══ */}
      {explainPriceModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-cream border border-soil-brown/20 rounded-3xl p-6 max-w-md w-full space-y-4 relative text-xs">
            <button onClick={() => setExplainPriceModal(null)} className="absolute top-4 right-4 text-mountain-gray hover:text-charcoal">✕</button>
            <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
              💡 AI Price Valuation Breakdown
            </h3>
            <p className="text-soil-brown leading-relaxed bg-white p-3.5 rounded-xl border border-soil-brown/10">
              {explainPriceModal.priceExplanation}
            </p>
            <div className="space-y-2 pt-1 text-mountain-gray">
              <div className="flex justify-between"><span>Listed Price:</span> <strong className="text-sunrise">रू {explainPriceModal.priceNPR}</strong></div>
              <div className="flex justify-between"><span>Regional Market Avg:</span> <strong className="text-charcoal">रू {explainPriceModal.marketAvgNPR}</strong></div>
              <div className="flex justify-between"><span>Organic Rating:</span> <strong className="text-primary-green">{explainPriceModal.organic ? 'Certified Biochar' : 'Standard'}</strong></div>
            </div>
            <button onClick={() => setExplainPriceModal(null)} className="w-full py-2.5 bg-primary-green hover:bg-secondary-green text-white font-bold rounded-xl transition">Close Explanation</button>
          </div>
        </div>
      )}

      {/* ═══ CHECKOUT MODAL ═══ */}
      {checkoutProduct && !orderCertificate && (() => {
        const total = checkoutQty * checkoutProduct.priceNPR;
        const grandTotal = total + (total >= 2000 ? 0 : 150);
        const handlePlaceOrder = () => {
          const certId = 'ECO-CERT-' + Math.floor(100000 + Math.random() * 900000);
          setOrderCertificate({
            certId,
            product: checkoutProduct,
            qty: checkoutQty,
            total: grandTotal,
            buyerName,
            buyerPhone,
            paymentMethod,
            timestamp: new Date().toLocaleString(),
          });
          setCheckoutProduct(null);
        };
        return (
          <div className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-soil-brown/10 rounded-3xl p-6 max-w-lg w-full space-y-4 relative text-xs shadow-lg">
              <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-mountain-gray hover:text-charcoal">✕</button>
              <h3 className="text-base font-black text-charcoal">Guest Order & Digital Certificate Setup</h3>
              <div className="p-3 bg-bg-cream rounded-xl space-y-2">
                <div className="flex justify-between"><span className="text-mountain-gray">Item:</span> <strong className="text-charcoal">{checkoutProduct.name}</strong></div>
                <div className="flex justify-between"><span className="text-mountain-gray">Total NPR:</span> <strong className="text-sunrise">रू {grandTotal.toLocaleString()}</strong></div>
              </div>
              <div className="space-y-2">
                <input type="text" placeholder="Full Name" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="w-full bg-bg-cream p-2.5 rounded-xl border border-soil-brown/20 text-charcoal focus:ring-secondary-green" />
                <input type="tel" placeholder="Phone Number" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} className="w-full bg-bg-cream p-2.5 rounded-xl border border-soil-brown/20 text-charcoal focus:ring-secondary-green" />
                <input type="text" placeholder="Delivery Address" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} className="w-full bg-bg-cream p-2.5 rounded-xl border border-soil-brown/20 text-charcoal focus:ring-secondary-green" />
              </div>
              <button onClick={handlePlaceOrder} disabled={!buyerName || !buyerPhone} className="w-full py-3 bg-primary-green hover:bg-secondary-green disabled:opacity-40 text-white font-black rounded-xl transition shadow-md">
                Pay & Generate Official Digital Certificate
              </button>
            </div>
          </div>
        );
      })()}

      {/* ═══ BUYER DIGITAL PURCHASE CERTIFICATE MODAL ═══ */}
      {orderCertificate && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-charcoal border-4 border-primary-green rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-center relative">
            <div className="space-y-1 border-b border-soil-brown/20 pb-4">
              <span className="px-3 py-0.5 bg-accent-green/20 text-primary-green font-extrabold text-[10px] uppercase rounded-full tracking-widest border border-accent-green/30">
                Official Government-Grade Certificate
              </span>
              <h2 className="text-2xl font-black tracking-tight text-charcoal">Digital Purchase Certificate</h2>
              <p className="text-xs text-mountain-gray font-bold">Certificate ID: {orderCertificate.certId}</p>
            </div>

            {/* Embedded QR Code Stamp */}
            <div className="w-36 h-36 bg-bg-cream p-3 rounded-2xl mx-auto border-2 border-secondary-green shadow-sm">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path d="M0,0 h30 v30 h-30 z M70,0 h30 v30 h-30 z M0,70 h30 v30 h-30 z" fill="#1B5E20" />
                <path d="M5,5 h20 v20 h-20 z M75,5 h20 v20 h-20 z M5,75 h20 v20 h-20 z" fill="#FAF9F4" />
                <path d="M35,35 h30 v30 h-30 z" fill="#4CAF50" />
              </svg>
            </div>

            <div className="bg-bg-cream p-4 rounded-2xl border border-soil-brown/10 space-y-2 text-xs text-left">
              <div className="flex justify-between"><span className="text-mountain-gray font-bold">Buyer Name</span><span className="font-extrabold text-charcoal">{orderCertificate.buyerName}</span></div>
              <div className="flex justify-between"><span className="text-mountain-gray font-bold">Product</span><span className="font-extrabold text-charcoal">{orderCertificate.product.name}</span></div>
              <div className="flex justify-between"><span className="text-mountain-gray font-bold">Verified Farmer</span><span className="font-extrabold text-primary-green">{farmerProfiles[orderCertificate.product.farmerId].name}</span></div>
              <div className="flex justify-between"><span className="text-mountain-gray font-bold">Amount Paid</span><span className="font-black text-primary-green">रू {orderCertificate.total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-mountain-gray font-bold">Timestamp</span><span className="font-bold text-soil-brown">{orderCertificate.timestamp}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => alert('Downloading Official Certificate PDF...')} className="py-3 bg-white border border-soil-brown/20 hover:bg-bg-cream text-charcoal font-bold text-xs rounded-xl shadow-xs transition">
                📄 Download PDF
              </button>
              <button onClick={() => setOrderCertificate(null)} className="py-3 bg-primary-green hover:bg-secondary-green text-white font-black text-xs rounded-xl shadow-sm transition">
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmMarketplace;
