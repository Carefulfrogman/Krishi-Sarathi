import React, { useState } from 'react';
import Icon from '../components/Icons';

export const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.displayName || 'Farmer Demo User',
    email: user?.email || 'farmer@krishisaarathi.com',
    phone: '+977 9841-234567',
    role: 'farmer',
    organization: 'Green Horizon Agro Co.',
    location: 'Chitwan Valley, Nepal',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Profile updated successfully!');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-emerald-100 shadow-sm">
          {profile.name.charAt(0)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
            <span className="eco-badge eco-badge-success text-[10px]">Verified Farmer</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{profile.organization} • {profile.location}</p>
        </div>
      </div>

      <div className="eco-card bg-white space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Icon name="user" size={18} className="text-emerald-600" /> User Profile & Role Settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Platform Role</label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
              >
                <option value="farmer">Farmer / Agro-Producer</option>
                <option value="buyer">Carbon Credit Buyer / Corporate</option>
                <option value="verifier">ESG Verifier / Auditor</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
