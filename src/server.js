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

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ─── Mount Routes ───────────────────────────────────────────
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
