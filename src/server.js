require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { initTransporter } = require('./services/emailService');

// ─── Initialize Express ─────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxy (e.g. Render load balancer) to ensure rate limiters use the correct client IP.
app.set('trust proxy', 1);

// ─── Security Middleware ────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,  // Allow inline scripts in dashboard
  crossOriginEmbedderPolicy: false,
}));
app.disable('x-powered-by');

// CORS — allow all origins (API is public, dashboard + frontend are same-origin)
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing — increased limit for markdown research papers
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: false, limit: '500kb' }));

// Serve static dashboard UI
app.use(express.static(path.join(__dirname, '../public')));

// Global rate limiter on all /api routes
app.use('/api', apiLimiter);

const { pool } = require('./db/database');

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT 1 as db_status');
    res.json({
      status: 'ok',
      db: dbRes.rows[0].db_status === 1 ? 'connected' : 'error',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db_error: String(err),
      db_stack: err ? err.stack : undefined,
      has_db_url: !!process.env.DATABASE_URL,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  }
});

// ─── Mount Routes ───────────────────────────────────────────
app.get('/api/admin/seed-papers', async (req, res) => {
  try {
    const { pool } = require('./db/database');
    await pool.query('TRUNCATE TABLE research_papers RESTART IDENTITY CASCADE');
    const papers = [
      {
        slug: 'decoupling-teng-interference',
        title: 'Decoupling Triboelectric Interference in High-Transmittance TENG Displays',
        abstract: 'A novel architectural approach to isolating contact-electrification noise from capacitive touch signals in fully transparent, >85% transmittance triboelectric nanogenerator arrays.',
        content: '## Abstract\nThe integration of Triboelectric Nanogenerators (TENG) into standard touch-capacitive arrays has historically suffered from signal cross-talk. This paper demonstrates a novel elastomer-based isolation layer that effectively decouples contact-electrification noise, achieving a 99% signal purity while maintaining 88% optical transmittance.\n\n## Methodology\nBy utilizing an ionic liquid-infused polyurethane matrix, we constructed a micro-grid layer between the TENG surface and the capacitive subpixel array...\n\n## Results\nThe array successfully harvested 1.2mW/cm2 during standard typing intervals without causing false-positive touch registers.',
        authors: 'Dr. E. Vance, A. Sterling',
        category: 'TENG Physics',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        slug: 'piezoelectric-elastomeric-composites',
        title: 'Hyper-Stretchable Piezoelectric Composites for Wearable Kinetic Interfaces',
        abstract: 'Formulating a PVDF-based polyurethane-urea elastomer that maintains piezoelectric integrity and optical clarity even under 300% mechanical strain.',
        content: '## Abstract\nWearable interfaces require extreme durability. Traditional ITO-based electrodes fracture under strain. We introduce a PVDF-composite elastomer that generates 0.8V per standard tap while stretching up to 300%.\n\n## Architecture\nThe composite is synthesized via electrospinning, creating an aligned microfiber network that enhances the piezoelectric d33 coefficient...\n\n## Conclusion\nThis material sets a new benchmark for self-powered e-skin and kinetic display interfaces.',
        authors: 'Dr. M. Chen',
        category: 'Materials Science',
        color: 'from-amber-500 to-orange-500'
      },
      {
        slug: 'self-powered-emissive-architecture',
        title: 'Self-Powered Subpixel Emissive Architecture using Transparent Harvesters',
        abstract: 'A comprehensive study on directly routing TENG-harvested energy into localized OLED subpixels to achieve localized micro-illumination without external power.',
        content: '## Abstract\nWe propose a direct-drive micro-architecture where localized triboelectric energy is routed to adjacent OLED subpixels. This achieves instant visual feedback driven entirely by the user’s kinetic touch energy.\n\n## System Design\nThe display matrix is segmented into 100μm autonomous nodes. A press event generates a localized 5V spike, which is rectified and directly drives the blue-diode subpixel...\n\n## Implications\nThis represents the first step toward a completely battery-free human-machine interface for specialized, low-power diagnostic environments.',
        authors: 'J. Bhanderi, T. R&D',
        category: 'Display Architecture',
        color: 'from-fuchsia-500 to-rose-500'
      }
    ];
    for (const p of papers) {
      await pool.query(
        'INSERT INTO research_papers (slug, title, abstract, content, authors, category, color) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.slug, p.title, p.abstract, p.content, p.authors, p.category, p.color]
      );
    }
    res.json({ status: 'success', message: 'Energy-Harvesting papers seeded successfully.' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/admin/publish-daily', async (req, res) => {
  try {
    const { pool } = require('./db/database');
    const paper = {
      slug: 'kinetic-conversion-efficiency',
      title: 'Kinetic Conversion Efficiency in Elastomeric TENG Displays',
      abstract: 'An empirical analysis of energy conversion efficiency ratios across highly flexible polyurethane-urea elastomers embedded with PVDF nanoparticles for next-generation touch interfaces.',
      content: '## Abstract\nRecent breakthroughs in piezoelectric transparent electrodes have pushed optical transmittance above 85%. However, mechanical strain often reduces kinetic conversion efficiency. We present an empirical study of PVDF-embedded elastomeric substrates capable of maintaining a 4.2% energy conversion efficiency even under 200% mechanical strain.\n\n## Empirical Data\nTesting across 10,000 standard touch-press cycles (approx. 2.5 N of force), the composite matrix consistently output 1.4mW/cm2, demonstrating negligible degradation in electrical output.\n\n## Implications\nThis consistent energy harvesting threshold is sufficient to power low-energy emissive subpixels dynamically, closing the loop on fully self-powered transparent interfaces.',
      authors: 'Dr. E. Vance',
      category: 'Kinetic Physics',
      color: 'from-violet-500 to-fuchsia-500'
    };
    await pool.query(
      'INSERT INTO research_papers (slug, title, abstract, content, authors, category, color) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [paper.slug, paper.title, paper.abstract, paper.content, paper.authors, paper.category, paper.color]
    );
    res.json({ status: 'success', message: 'Daily paper published.' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.use('/api/waitlist', require('./routes/waitlist'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/papers', require('./routes/papers'));

// ─── Serve React Frontend (built files) ────────────────────
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// ─── SPA Catch-All (React Router) ──────────────────────────
// Any non-API, non-dashboard route falls through to React's index.html
app.get('*', (req, res) => {
  // Don't catch /dashboard.html — it's already served from public/
  if (req.path === '/dashboard.html') {
    return res.status(404).json({ error: 'Endpoint not found.' });
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// ─── Centralized Error Handler ──────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log('\n');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║                                          ║');
  console.log('  ║   ██  ██  ██   Hylunian Backend API      ║');
  console.log('  ║                                          ║');
  console.log(`  ║   → http://localhost:${PORT}               ║`);
  console.log(`  ║   → ${process.env.NODE_ENV || 'development'} mode                ║`);
  console.log('  ║                                          ║');
  console.log(`  ║   Dashboard: /dashboard.html              ║`);
  console.log('  ║                                          ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('\n');

  // Initialize email transporter after server starts
  initTransporter();
});

// ─── Graceful Shutdown ──────────────────────────────────────
function gracefulShutdown(signal) {
  console.log(`\n⚡ ${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });

  // Force kill after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
