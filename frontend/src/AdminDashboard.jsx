import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api'
);

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('hylunian_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, isSearching]);

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
        fetch(`${API_BASE}/admin/waitlist?limit=50&search=${search}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout();
        return;
      }
      
      const statsData = await statsRes.json();
      const waitlistData = await waitlistRes.json();
      
      setStats(statsData);
      setWaitlist(waitlistData.entries || []);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/waitlist/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/waitlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchDashboardData();
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
          className="w-full max-w-md p-10 border bg-beige-100/50 border-zinc-950/20"
        >
          <div className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">
            [ Security Protocol ]
          </div>
          <h2 className="font-serif text-3xl mb-8 text-zinc-950">Command Center Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full px-4 py-3 border focus:outline-none transition-colors bg-beige-50 border-zinc-950/20 text-zinc-950 focus:border-zinc-950"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border focus:outline-none transition-colors bg-beige-50 border-zinc-950/20 text-zinc-950 focus:border-zinc-950"
            />
            {error && <p className="text-red-600 text-sm font-mono mt-2">{error}</p>}
            <button type="submit" className="w-full py-3 mt-4 font-mono text-sm uppercase tracking-widest transition-colors bg-zinc-950 text-beige-50 hover:bg-zinc-800">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-16 pb-8 border-b border-zinc-950/10">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">
            [ Authorized ]
          </div>
          <h1 className="font-serif text-4xl text-zinc-950">Command Center</h1>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-[11px] font-mono uppercase tracking-widest border transition-colors bg-beige-100/50 border-zinc-950/20 text-zinc-600 hover:bg-zinc-950 hover:text-beige-50">
          Disconnect
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 border bg-beige-100/50 border-zinc-950/20">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">Total Waitlist</p>
            <p className="font-serif text-5xl text-zinc-950">{stats.total}</p>
          </div>
          <div className="p-8 border bg-beige-100/50 border-zinc-950/20">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">Joined Today</p>
            <p className="font-serif text-5xl text-zinc-950">{stats.today}</p>
          </div>
          <div className="p-8 border bg-beige-100/50 border-zinc-950/20 relative overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">7-Day Growth Average</p>
            <p className="font-serif text-5xl text-zinc-950 relative z-10">{stats.growth?.dailyAverage || 0} <span className="text-xl font-mono text-zinc-400">/ day</span></p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-950/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (stats.growth?.dailyAverage || 0) * 5)}%` }}
                className="h-full bg-zinc-950"
              />
            </div>
          </div>
        </div>
      )}

      <div className="border bg-beige-100/50 border-zinc-950/20">
        <div className="p-6 border-b border-zinc-950/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="font-serif text-2xl text-zinc-950">Waitlist Directory</h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsSearching(!isSearching)}
              className="px-4 py-2 text-sm font-mono border bg-beige-50 border-zinc-950/20 focus:outline-none focus:border-zinc-950 w-full md:w-64"
            />
            <button onClick={() => setIsSearching(!isSearching)} className="px-4 py-2 text-[11px] font-mono uppercase tracking-widest bg-zinc-200 text-zinc-800 hover:bg-zinc-300">
              Search
            </button>
            <a href={`${API_BASE}/admin/waitlist/export`} target="_blank" rel="noreferrer" className="px-4 py-2 text-[11px] font-mono uppercase tracking-widest bg-zinc-950 text-beige-50 hover:bg-zinc-800 whitespace-nowrap">
              Export CSV
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 border-b border-zinc-950/10">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-600 font-mono">
              {waitlist.map((entry) => (
                <tr key={entry.id} className="border-b border-zinc-950/5 last:border-0 hover:bg-beige-100 transition-colors">
                  <td className="px-6 py-4 opacity-50">{entry.id}</td>
                  <td className="px-6 py-4 text-zinc-950">{entry.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[11px] uppercase tracking-widest ${entry.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 opacity-50">{new Date(entry.created_at + 'Z').toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {entry.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(entry.id, 'invited')}
                        className="px-2 py-1 text-[10px] uppercase tracking-widest bg-zinc-950 text-beige-50 hover:bg-zinc-800"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="px-2 py-1 text-[10px] uppercase tracking-widest bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
