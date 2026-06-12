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
      },
      {
        slug: 'refractive-matching-teng-layers',
        title: 'Refractive Index Matching in Multi-Layer PVDF-TrFE Thin Films',
        abstract: 'Mitigating reflection and scattering boundaries between transparent electrode composites and piezoelectric layers to achieve <1.2% total display reflectance.',
        content: '## Abstract\nMulti-layer transparent piezoelectric displays suffer from parasitic reflections at internal material interfaces. We report an index-matching methodology for poly(vinylidene fluoride-trifluoroethylene) [PVDF-TrFE] thin films using sub-wavelength silicon dioxide nanoparticle dispersions.\n\n## Optical Optimization\nBy tuning the nanoparticle volume fraction, we matched the film index from n = 1.42 to n = 1.48, eliminating parallax refraction...\n\n## Conclusion\nThe resulting multi-layer stack achieved 91% total light transmission and zero visible rainbow artifacts.',
        authors: 'A. Vance, Dr. H. Pascal',
        category: 'Optical Engineering',
        color: 'from-blue-500 to-indigo-500'
      },
      {
        slug: 'elastomer-fatigue-teng-stress',
        title: 'Triboelectric Elastomer Degradation under Empirical Mechanical Stress',
        abstract: 'Evaluating the chemical and electrical fatigue life of transparent polydimethylsiloxane (PDMS) elastomer composites under 100,000 continuous touch stress cycles.',
        content: '## Abstract\nLong-term durability is a critical obstacle for commercial triboelectric display skins. This study monitors the mechanical degradation of micro-structured PDMS over 100,000 cycles. We show that fluorinated silanes maintain surface charge density with minimal structural fatigue.\n\n## Stress Profile\nA pneumatic actuator applied a localized 5N force at 2Hz. Electrical output was tracked in real-time, showing a minor 8% drop in peak voltage after 100k cycles...\n\n## Results\nThe micro-pillars retained their elastic recovery, proving the material is suitable for high-frequency user touch interfaces.',
        authors: 'Dr. K. Zhao, J. Bhanderi',
        category: 'Materials Science',
        color: 'from-violet-500 to-purple-500'
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
      slug: 'piezoceramic-optical-arrays',
      title: 'Piezoceramic Optical Arrays for Kinetic Harvest',
      abstract: 'A breakthrough in utilizing ultra-thin piezoceramic compounds to achieve 92% optical clarity while harvesting ambient kinetic touch energy at 1.8mW/cm2.',
      content: '## Abstract\nTraditionally, piezoceramic materials suffer from poor optical transmittance, rendering them unsuitable for display interfaces. We introduce a nano-patterned Barium Titanate (BaTiO3) array embedded in an index-matched polymer matrix that bypasses this limitation.\n\n## Methodology\nBy matching the refractive index of the BaTiO3 nano-pillars with a cyclo-olefin polymer substrate, scattering is virtually eliminated. This results in a 92% optical transmittance in the visible spectrum.\n\n## Kinetic Yield\nWhen subjected to standard human touch pressure (approx. 2N), the array generates an average of 1.8mW/cm2, which is immediately routed to local subpixel drivers.\n\n## Conclusion\nThis represents a massive leap in self-powered emissive displays, enabling fully transparent kinetic interfaces without external power dependency.',
      authors: 'Dr. A. Sterling',
      category: 'Materials Science',
      color: 'from-cyan-500 to-blue-500'
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
