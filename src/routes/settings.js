const express = require('express');
const { statements } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/settings ──────────────────────────────────────
// Public — fetch all site settings
router.get('/', async (req, res, next) => {
  try {
    const settings = await statements.getAllSettings.all();
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json(settingsMap);
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/settings ──────────────────────────────────────
// Protected — update site settings
router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const settingsToUpdate = req.body;
    
    if (typeof settingsToUpdate !== 'object' || settingsToUpdate === null) {
      return res.status(400).json({ error: 'Invalid settings format. Expected JSON object.' });
    }

    // Upsert each setting
    for (const [key, value] of Object.entries(settingsToUpdate)) {
      if (typeof value === 'string') {
        await statements.upsertSetting.run(key, value);
      }
    }

    res.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
