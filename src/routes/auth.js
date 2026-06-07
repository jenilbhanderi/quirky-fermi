const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { handleValidationErrors } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { generateToken } = require('../middleware/auth');
const { statements } = require('../db/database');

const router = express.Router();

const SALT_ROUNDS = 12;
const INVITE_CODE = process.env.ADMIN_INVITE_CODE || 'hylunian-alpha-2026';

// ─── POST /api/auth/register ────────────────────────────────
// Create an admin account (requires invite code)
router.post(
  '/register',
  authLimiter,
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3–30 characters.')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username may only contain letters, numbers, hyphens, and underscores.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.'),
    body('inviteCode')
      .notEmpty()
      .withMessage('Invite code is required.'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { username, password, inviteCode } = req.body;

      // Verify invite code
      if (inviteCode !== INVITE_CODE) {
        return res.status(403).json({ error: 'Invalid invite code.' });
      }

      // Check for existing username
      const existing = statements.getAdminByUsername.get(username);
      if (existing) {
        return res.status(409).json({ error: 'Username already taken.' });
      }

      // Hash password and create admin
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const result = statements.insertAdmin.run(username, passwordHash);

      // Generate JWT
      const token = generateToken({
        id: result.lastInsertRowid,
        username,
      });

      res.status(201).json({
        message: 'Admin account created.',
        token,
        admin: { id: result.lastInsertRowid, username },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/login ───────────────────────────────────
// Admin login — returns JWT
router.post(
  '/login',
  authLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = statements.getAdminByUsername.get(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = generateToken({ id: user.id, username: user.username });

      res.json({
        message: 'Login successful.',
        token,
        admin: { id: user.id, username: user.username },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
