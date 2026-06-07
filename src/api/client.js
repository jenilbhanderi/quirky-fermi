/**
 * API client for Hylunian Backend
 * Base URL defaults to localhost:3001 in development
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Attach auth token if available
  const token = localStorage.getItem('hylunian_admin_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  // Handle CSV export (non-JSON response)
  if (response.headers.get('Content-Type')?.includes('text/csv')) {
    const blob = await response.blob();
    return { blob, filename: getFilenameFromHeader(response) };
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

function getFilenameFromHeader(response) {
  const disposition = response.headers.get('Content-Disposition');
  if (disposition) {
    const match = disposition.match(/filename="?(.+?)"?$/);
    if (match) return match[1];
  }
  return `hylunian-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
}

// ─── Public API ─────────────────────────────────────────────

/**
 * Submit an email to the waitlist
 * @param {string} email 
 * @returns {Promise<{message: string, id: number}>}
 */
export async function joinWaitlist(email) {
  return apiFetch('/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ─── Auth API ───────────────────────────────────────────────

/**
 * Admin login
 * @returns {Promise<{token: string, admin: {id: number, username: string}}>}
 */
export async function adminLogin(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data.token) {
    localStorage.setItem('hylunian_admin_token', data.token);
  }
  return data;
}

/**
 * Admin registration with invite code
 */
export async function adminRegister(username, password, inviteCode) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, inviteCode }),
  });
  if (data.token) {
    localStorage.setItem('hylunian_admin_token', data.token);
  }
  return data;
}

/**
 * Clear stored admin token
 */
export function adminLogout() {
  localStorage.removeItem('hylunian_admin_token');
}

/**
 * Check if admin is currently authenticated
 */
export function isAdminAuthenticated() {
  return !!localStorage.getItem('hylunian_admin_token');
}

// ─── Admin API ──────────────────────────────────────────────

/**
 * Get waitlist entries (paginated, searchable)
 * @param {Object} params - { page, limit, search }
 */
export async function getWaitlist({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit, search });
  return apiFetch(`/admin/waitlist?${params}`);
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats() {
  return apiFetch('/admin/waitlist/stats');
}

/**
 * Delete a waitlist entry
 * @param {number} id 
 */
export async function deleteWaitlistEntry(id) {
  return apiFetch(`/admin/waitlist/${id}`, { method: 'DELETE' });
}

/**
 * Export waitlist as CSV — triggers browser download
 */
export async function exportWaitlistCSV() {
  const { blob, filename } = await apiFetch('/admin/waitlist/export');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Health Check ───────────────────────────────────────────

export async function healthCheck() {
  return apiFetch('/health');
}
