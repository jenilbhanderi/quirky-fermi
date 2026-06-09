const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hylunian';
const isProduction = process.env.NODE_ENV === 'production';
const isInternal = connectionString.includes('.internal');

const pool = new Pool({
  connectionString,
  ssl: isProduction && !isInternal ? { rejectUnauthorized: false } : false
});

// ─── Table Creation ─────────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'invited')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS research_papers (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      abstract TEXT NOT NULL,
      content TEXT,
      authors TEXT,
      category TEXT,
      color TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
    CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
    CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
    CREATE INDEX IF NOT EXISTS idx_papers_slug ON research_papers(slug);
    CREATE INDEX IF NOT EXISTS idx_papers_created ON research_papers(created_at);
  `);
}

initDb()
  .then(() => console.log('✅ PostgreSQL Database schema initialized.'))
  .catch(err => {
    console.error('❌ PostgreSQL Database initialization failed:');
    console.error(err);
  });

// ─── Async "Prepared Statements" ────────────────────────────
const statements = {
  // Waitlist
  insertWaitlist: {
    run: async (email, ip) => {
      const res = await pool.query('INSERT INTO waitlist (email, ip_address) VALUES ($1, $2) RETURNING id', [email, ip]);
      return { lastInsertRowid: res.rows[0].id };
    }
  },
  getWaitlistByEmail: {
    get: async (email) => {
      const res = await pool.query('SELECT * FROM waitlist WHERE email = $1', [email]);
      return res.rows[0];
    }
  },
  getAllWaitlist: {
    all: async (limit, offset) => {
      const res = await pool.query('SELECT id, email, status, created_at FROM waitlist ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.rows;
    }
  },
  searchWaitlist: {
    all: async (pattern, limit, offset) => {
      const res = await pool.query('SELECT id, email, status, created_at FROM waitlist WHERE email LIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [pattern, limit, offset]);
      return res.rows;
    }
  },
  countWaitlist: {
    get: async () => {
      const res = await pool.query('SELECT COUNT(*) as total FROM waitlist');
      return { total: parseInt(res.rows[0].total, 10) };
    }
  },
  countWaitlistSearch: {
    get: async (pattern) => {
      const res = await pool.query('SELECT COUNT(*) as total FROM waitlist WHERE email LIKE $1', [pattern]);
      return { total: parseInt(res.rows[0].total, 10) };
    }
  },
  countWaitlistToday: {
    get: async () => {
      const res = await pool.query("SELECT COUNT(*) as total FROM waitlist WHERE DATE(created_at) = CURRENT_DATE");
      return { total: parseInt(res.rows[0].total, 10) };
    }
  },
  countWaitlistThisWeek: {
    get: async () => {
      const res = await pool.query("SELECT COUNT(*) as total FROM waitlist WHERE created_at >= NOW() - INTERVAL '7 days'");
      return { total: parseInt(res.rows[0].total, 10) };
    }
  },
  deleteWaitlistById: {
    run: async (id) => {
      await pool.query('DELETE FROM waitlist WHERE id = $1', [id]);
    }
  },
  getWaitlistById: {
    get: async (id) => {
      const res = await pool.query('SELECT * FROM waitlist WHERE id = $1', [id]);
      return res.rows[0];
    }
  },
  exportWaitlist: {
    all: async () => {
      const res = await pool.query('SELECT id, email, status, created_at FROM waitlist ORDER BY created_at DESC');
      return res.rows;
    }
  },

  // Admin
  insertAdmin: {
    run: async (username, password_hash) => {
      const res = await pool.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING id', [username, password_hash]);
      return { lastInsertRowid: res.rows[0].id };
    }
  },
  getAdminByUsername: {
    get: async (username) => {
      const res = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
      return res.rows[0];
    }
  },

  // Settings
  getSettingByKey: {
    get: async (key) => {
      const res = await pool.query('SELECT value FROM site_settings WHERE key = $1', [key]);
      return res.rows[0] ? res.rows[0].value : undefined;
    }
  },
  getAllSettings: {
    all: async () => {
      const res = await pool.query('SELECT key, value FROM site_settings');
      return res.rows;
    }
  },
  upsertSetting: {
    run: async (key, value) => {
      await pool.query(
        `INSERT INTO site_settings (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    }
  },

  // Papers
  insertPaper: {
    run: async (slug, title, abstract, content, authors, category, color) => {
      const res = await pool.query(
        'INSERT INTO research_papers (slug, title, abstract, content, authors, category, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [slug, title, abstract, content, authors, category, color]
      );
      return { lastInsertRowid: res.rows[0].id };
    }
  },
  updatePaper: {
    run: async (slug, title, abstract, content, authors, category, color, id) => {
      await pool.query(
        'UPDATE research_papers SET slug = $1, title = $2, abstract = $3, content = $4, authors = $5, category = $6, color = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8',
        [slug, title, abstract, content, authors, category, color, id]
      );
    }
  },
  getAllPapers: {
    all: async () => {
      const res = await pool.query('SELECT id, slug, title, abstract, authors, category, color, created_at FROM research_papers ORDER BY created_at DESC');
      return res.rows;
    }
  },
  getPaperBySlug: {
    get: async (slug) => {
      const res = await pool.query('SELECT * FROM research_papers WHERE slug = $1', [slug]);
      return res.rows[0];
    }
  },
  getPaperById: {
    get: async (id) => {
      const res = await pool.query('SELECT * FROM research_papers WHERE id = $1', [id]);
      return res.rows[0];
    }
  },
  deletePaperById: {
    run: async (id) => {
      await pool.query('DELETE FROM research_papers WHERE id = $1', [id]);
    }
  }
};

module.exports = { pool, statements };
