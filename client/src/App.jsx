import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FarmRegistration from './pages/FarmRegistration';
import FarmDetails from './pages/FarmDetails';
import Marketplace from './pages/Marketplace';
import CarbonCredits from './pages/CarbonCredits';
import SustainabilityScore from './pages/SustainabilityScore';
import AiAssistant from './pages/AiAssistant';
import BuyerDashboard from './pages/BuyerDashboard';
import FarmMarketplace from './pages/FarmMarketplace';
import ListProduct from './pages/ListProduct';
import InsuranceClaim from './pages/InsuranceClaim';
import DisasterReport from './pages/DisasterReport';
import QRTrace from './pages/QRTrace';
import SupplyChain from './pages/SupplyChain';
import Reports from './pages/Reports';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';

function AppLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Public standalone pages without dashboard shell layout
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/about' || location.pathname === '/farm-marketplace' || location.pathname === '/qr';

  if (!user && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  if (isPublicPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar user={user} onLogout={onLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <AppLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path="/signup" element={<Signup onSignup={(u) => setUser(u)} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms/register" element={<FarmRegistration />} />
          <Route path="/farms/:id" element={<FarmDetails />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/farm-marketplace" element={<FarmMarketplace />} />
          <Route path="/list-product" element={<ListProduct />} />
          <Route path="/carbon" element={<CarbonCredits />} />
          <Route path="/sustainability" element={<SustainabilityScore />} />
          <Route path="/assistant" element={<AiAssistant />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/insurance" element={<InsuranceClaim />} />
          <Route path="/disasters" element={<DisasterReport />} />
          <Route path="/qr" element={<QRTrace />} />
          <Route path="/supplychain" element={<SupplyChain />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
