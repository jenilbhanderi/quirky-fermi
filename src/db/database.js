import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hylunian';

export const pool = new Pool({
  connectionString
});

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        ip_address TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'invited')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
      CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
    `);
    isInitialized = true;
    console.log('✅ PostgreSQL Database schema initialized.');
  } catch (err) {
    console.error('❌ PostgreSQL Database initialization failed:');
    console.error(err);
  }
}

// Proactively run initialization (will be non-blocking)
initDb().catch(() => {});

export const statements = {
  insertWaitlist: {
    run: async (email, ip) => {
      await initDb();
      const res = await pool.query(
        'INSERT INTO waitlist (email, ip_address) VALUES ($1, $2) RETURNING id',
        [email, ip]
      );
      return { lastInsertRowid: res.rows[0].id };
    }
  },
  getWaitlistByEmail: {
    get: async (email) => {
      await initDb();
      const res = await pool.query('SELECT * FROM waitlist WHERE email = $1', [email]);
      return res.rows[0];
    }
  },
  countWaitlist: {
    get: async () => {
      await initDb();
      const res = await pool.query('SELECT COUNT(*) as total FROM waitlist');
      return { total: parseInt(res.rows[0].total, 10) };
    }
  }
};
