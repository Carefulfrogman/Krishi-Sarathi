import React, { useEffect, useState } from 'react';
import Icon from '../components/Icons';
import { carbonService } from '../services/api';

export const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Projects');

  useEffect(() => {
    const loadListings = async () => {
      try {
        const res = await carbonService.getListings();
        setListings(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);

  const handleBuy = (listing) => {
    setSelectedListing(listing);
    setPurchaseAmount(listing.min_purchase);
    setShowModal(true);
  };

  const confirmPurchase = () => {
    alert(`Successfully purchased ${purchaseAmount} tCO₂e carbon credits for $${(purchaseAmount * selectedListing.price_per_credit).toFixed(2)} USD! Certificate issued to your account.`);
    setShowModal(false);
  };

  const filters = ["All Projects", "Chitwan", "Pokhara", "Mustang", "Sunsari", "Kavre", "Vintage Year"];

  const filteredListings = React.useMemo(() => {
    if (activeFilter === 'All Projects') return listings;
    if (activeFilter === 'Vintage Year') {
      return [...listings].sort((a, b) => b.vintage.localeCompare(a.vintage));
    }
    return listings.filter(item => item.location.includes(activeFilter));
  }, [listings, activeFilter]);

  return (
    <div className="space-y-6 bg-bg-cream min-h-full p-2">
      {/* Header */}
      <div className="p-8 bg-primary-green text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center">
            <img src="/logo2.png" alt="Krishi Saarathi Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <span className="px-3 py-1 bg-accent-green/20 text-accent-green border border-accent-green/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
              ESG Verified Carbon Trading
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">Carbon Credit Market</h1>
            <p className="text-sm text-bg-cream mt-1 max-w-xl opacity-90 leading-relaxed">
              Trade satellite-verified carbon offset credits directly with sustainable farmers.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center">
          <div className="px-5 py-3 bg-accent-green rounded-xl shadow-sm text-right">
            <div className="text-[10px] text-charcoal/80 font-bold uppercase tracking-wider">Market Index</div>
            <div className="text-xl font-black text-charcoal mt-0.5">$24.50 / tCO₂e</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeFilter === filter
                ? 'bg-secondary-green text-charcoal shadow-sm'
                : 'bg-white border border-mountain-gray/20 text-mountain-gray hover:border-mountain-gray/40 hover:text-charcoal'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {filteredListings.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border-t-4 border-t-accent-green border-x border-b border-mountain-gray/20 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-secondary-green/20 text-secondary-green border border-secondary-green/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Verified Vintage {item.vintage}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-mountain-gray font-bold">
                  <Icon name="mapPin" size={12} className="text-secondary-green" /> {item.location}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-charcoal leading-tight">{item.seller_name}</h3>
              <p className="text-xs text-soil-brown mt-2">High-sequestration organic agroforestry project.</p>

              <div className="mt-5 p-4 bg-bg-cream rounded-xl border border-mountain-gray/10 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">Available</div>
                  <div className="text-lg font-black text-charcoal mt-1">{item.amount} tCO₂e</div>
                </div>
                <div className="border-l border-mountain-gray/15">
                  <div className="text-[10px] text-mountain-gray font-bold uppercase tracking-wider">Price / Unit</div>
                  <div className="text-lg font-black text-primary-green mt-1">${item.price_per_credit}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-mountain-gray/10">
              <button
                onClick={() => handleBuy(item)}
                className="w-full py-3 bg-primary-green hover:bg-secondary-green text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <Icon name="dollarSign" size={16} /> Purchase Carbon Credits
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Modal */}
      {showModal && selectedListing && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-mountain-gray/20">
            <div className="flex items-center justify-between border-b border-mountain-gray/15 pb-4">
              <h3 className="text-lg font-extrabold text-charcoal">Confirm Carbon Credit Order</h3>
              <button onClick={() => setShowModal(false)} className="text-mountain-gray hover:text-charcoal transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="text-xs text-soil-brown">
              Seller: <strong className="text-charcoal text-sm">{selectedListing.seller_name}</strong>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-mountain-gray uppercase mb-2 tracking-wider">Quantity (tCO₂e)</label>
              <input
                type="number"
                min={selectedListing.min_purchase}
                max={selectedListing.amount}
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-bg-cream border border-mountain-gray/20 rounded-xl text-sm font-bold text-charcoal focus:ring-2 focus:ring-secondary-green focus:outline-none"
              />
              <p className="text-[11px] text-mountain-gray mt-2">Min purchase: {selectedListing.min_purchase} tCO₂e</p>
            </div>

            <div className="p-4 bg-bg-cream rounded-xl border border-mountain-gray/15 flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-soil-brown uppercase tracking-wider">Total Purchase Cost</span>
              <span className="text-xl font-black text-golden-harvest">
                ${(purchaseAmount * selectedListing.price_per_credit).toFixed(2)} USD
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-white border border-mountain-gray/20 text-charcoal text-xs font-bold rounded-xl hover:bg-bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="px-6 py-2.5 bg-primary-green text-white text-xs font-bold rounded-xl hover:bg-secondary-green shadow-sm transition-colors"
              >
                Complete Payment & Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
