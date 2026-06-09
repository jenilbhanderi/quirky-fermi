const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { statements } = require('../db/database');

const router = express.Router();

// All admin routes require JWT authentication
router.use(authenticateToken);

// ─── GET /api/admin/waitlist ────────────────────────────────
// List waitlist entries with pagination and optional search
router.get('/waitlist', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let entries, totalResult;

    if (search) {
      const pattern = `%${search}%`;
      entries = await statements.searchWaitlist.all(pattern, limit, offset);
      totalResult = await statements.countWaitlistSearch.get(pattern);
    } else {
      entries = await statements.getAllWaitlist.all(limit, offset);
      totalResult = await statements.countWaitlist.get();
    }

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/waitlist/stats ──────────────────────────
// Waitlist statistics
router.get('/waitlist/stats', async (req, res, next) => {
  try {
    const total = (await statements.countWaitlist.get()).total;
    const today = (await statements.countWaitlistToday.get()).total;
    const thisWeek = (await statements.countWaitlistThisWeek.get()).total;

    res.json({
      total,
      today,
      thisWeek,
      growth: {
        dailyAverage: thisWeek > 0 ? Math.round(thisWeek / 7) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/waitlist/export ─────────────────────────
// Export entire waitlist as CSV
router.get('/waitlist/export', async (req, res, next) => {
  try {
    const entries = await statements.exportWaitlist.all();

    // Build CSV
    const headers = 'id,email,status,created_at';
    const rows = entries.map(
      (e) => `${e.id},"${e.email}","${e.status}","${e.created_at}"`
    );
    const csv = [headers, ...rows].join('\n');

    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="hylunian-waitlist-${timestamp}.csv"`
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/admin/waitlist/:id ─────────────────────────
// Remove a waitlist entry by ID
router.delete('/waitlist/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID.' });
    }

    const entry = await statements.getWaitlistById.get(id);
    if (!entry) {
      return res.status(404).json({ error: 'Waitlist entry not found.' });
    }

    await statements.deleteWaitlistById.run(id);

    res.json({ message: 'Entry removed.', deleted: { id, email: entry.email } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
