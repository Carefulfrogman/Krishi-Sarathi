import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


export const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [region, setRegion] = useState('Terai Plains');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignup) {
      onSignup({
        displayName: farmName || fullName || 'Eco Farm Owner',
        email,
        role,
        region,
      });
    }
    if (role === 'buyer') {
      navigate('/buyer/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Organic Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-accent-green opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-golden-harvest opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-lg border border-soil-brown/10 space-y-6 relative z-10 my-8">
        <div className="text-center space-y-3">
          {/* Logo with Green touches */}
          <div className="w-16 h-16 rounded-2xl bg-white border border-soil-brown/20 flex items-center justify-center mx-auto shadow-sm overflow-hidden">
            <img src="/logo.jpg" alt="Krishi Saarathi Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-charcoal tracking-tight flex items-center justify-center gap-2">
            Namaste 🇳🇵 <span className="text-primary-green">Krishi Saarathi</span>
          </h1>
          <p className="text-xs text-mountain-gray">Join Nepal's first carbon-neutral smart farming community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ram Bahadur"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Farm / Co-op Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mustang Organic Co-op"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Agro-Ecological Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none font-semibold"
              >
                <option value="Terai Plains">Terai Plains (Chitwan, Jhapa, etc.)</option>
                <option value="Mid-Hills Region">Mid-Hills Region (Pokhara, Kavre, etc.)</option>
                <option value="Himalayan Highlands">Himalayan Highlands (Mustang, Solukhumbu, etc.)</option>
                <option value="Kathmandu Valley">Kathmandu Valley (Urban Green Farming)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Select Persona / Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none font-semibold"
              >
                <option value="farmer">🌾 Farmer — Agro-Producers & Farm Owners</option>
                <option value="buyer">🛒 Buyer — Retailers, Wholesalers & Organizations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="farmer@krishisaarathi.ag"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-soil-brown uppercase mb-1 tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-charcoal bg-bg-cream border border-soil-brown/20 rounded-xl focus:ring-2 focus:ring-secondary-green focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-green hover:bg-secondary-green text-white font-bold text-xs rounded-xl transition shadow-md hover:-translate-y-0.5 mt-2"
          >
            Create Account & Register Field
          </button>
        </form>

        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-mountain-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary-green hover:text-primary-green font-bold underline transition">
              Sign In
            </Link>
          </p>
        </div>

        <div className="text-center border-t border-soil-brown/10 pt-4 flex justify-between text-[10px] text-mountain-gray">
          <span>🌿 Carbon Smart Farming</span>
          <span>🇳🇵 Made for Himalayan Agro-ecosystems</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
