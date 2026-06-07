const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/hylunian.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read/write performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Table Creation ─────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'invited')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS research_papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    content TEXT,
    authors TEXT,
    category TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
  CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
  CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
  CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
  CREATE INDEX IF NOT EXISTS idx_papers_slug ON research_papers(slug);
  CREATE INDEX IF NOT EXISTS idx_papers_created ON research_papers(created_at);
`);

// ─── Prepared Statements ────────────────────────────────────
const statements = {
  // Waitlist
  insertWaitlist: db.prepare(
    'INSERT INTO waitlist (email, ip_address) VALUES (?, ?)'
  ),
  getWaitlistByEmail: db.prepare(
    'SELECT * FROM waitlist WHERE email = ?'
  ),
  getAllWaitlist: db.prepare(
    'SELECT id, email, status, created_at FROM waitlist ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ),
  searchWaitlist: db.prepare(
    'SELECT id, email, status, created_at FROM waitlist WHERE email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ),
  countWaitlist: db.prepare(
    'SELECT COUNT(*) as total FROM waitlist'
  ),
  countWaitlistSearch: db.prepare(
    'SELECT COUNT(*) as total FROM waitlist WHERE email LIKE ?'
  ),
  countWaitlistToday: db.prepare(
    `SELECT COUNT(*) as total FROM waitlist WHERE date(created_at) = date('now')`
  ),
  countWaitlistThisWeek: db.prepare(
    `SELECT COUNT(*) as total FROM waitlist WHERE created_at >= datetime('now', '-7 days')`
  ),
  deleteWaitlistById: db.prepare(
    'DELETE FROM waitlist WHERE id = ?'
  ),
  getWaitlistById: db.prepare(
    'SELECT * FROM waitlist WHERE id = ?'
  ),
  exportWaitlist: db.prepare(
    'SELECT id, email, status, created_at FROM waitlist ORDER BY created_at DESC'
  ),

  // Admin
  insertAdmin: db.prepare(
    'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)'
  ),
  getAdminByUsername: db.prepare(
    'SELECT * FROM admin_users WHERE username = ?'
  ),

  // Settings
  getSettingByKey: db.prepare(
    'SELECT value FROM site_settings WHERE key = ?'
  ),
  getAllSettings: db.prepare(
    'SELECT key, value FROM site_settings'
  ),
  upsertSetting: db.prepare(
    `INSERT INTO site_settings (key, value, updated_at) 
     VALUES (?, ?, CURRENT_TIMESTAMP) 
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
  ),

  // Papers
  insertPaper: db.prepare(
    'INSERT INTO research_papers (slug, title, abstract, content, authors, category, color) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ),
  updatePaper: db.prepare(
    'UPDATE research_papers SET slug = ?, title = ?, abstract = ?, content = ?, authors = ?, category = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ),
  getAllPapers: db.prepare(
    'SELECT id, slug, title, abstract, authors, category, color, created_at FROM research_papers ORDER BY created_at DESC'
  ),
  getPaperBySlug: db.prepare(
    'SELECT * FROM research_papers WHERE slug = ?'
  ),
  getPaperById: db.prepare(
    'SELECT * FROM research_papers WHERE id = ?'
  ),
  deletePaperById: db.prepare(
    'DELETE FROM research_papers WHERE id = ?'
  ),
};

module.exports = { db, statements };
