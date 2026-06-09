import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api'
);

export default function AdminDashboard({ isDark }) {
  const [token, setToken] = useState(localStorage.getItem('hylunian_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState(null);
  const [waitlist, setWaitlist] = useState([]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setToken(data.token);
      localStorage.setItem('hylunian_admin_token', data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('hylunian_admin_token');
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, waitlistRes] = await Promise.all([
        fetch(`${API_BASE}/admin/waitlist/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/waitlist?limit=50`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout();
        return;
      }
      
      const statsData = await statsRes.json();
      const waitlistData = await waitlistRes.json();
      
      setStats(statsData);
      setWaitlist(waitlistData.entries || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl border backdrop-blur-xl ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}
        >
          <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Command Center Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} onChange={e => setUsername(e.target.value)} required
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-white/30' : 'bg-zinc-50 border-black/10 text-black focus:border-black/30'}`}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)} required
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-white/30' : 'bg-zinc-50 border-black/10 text-black focus:border-black/30'}`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className={`w-full py-3 rounded-xl font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Command Center</h1>
        <button onClick={handleLogout} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}>
          Disconnect
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Waitlist</p>
            <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.total}</p>
          </div>
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Joined Today</p>
            <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.today}</p>
          </div>
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>7-Day Growth Average</p>
            <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.growth?.dailyAverage || 0} / day</p>
          </div>
        </div>
      )}

      <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Waitlist Directory</h2>
          <a href={`${API_BASE}/admin/waitlist/export`} target="_blank" rel="noreferrer" className={`px-4 py-2 text-sm font-medium rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            Export CSV
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-sm font-medium ${isDark ? 'text-zinc-400 border-white/10' : 'text-zinc-500 border-black/10'} border-b`}>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {waitlist.map((entry) => (
                <tr key={entry.id} className={`border-b last:border-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <td className="px-6 py-4">{entry.id}</td>
                  <td className="px-6 py-4 font-medium">{entry.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${entry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(entry.created_at + 'Z').toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
