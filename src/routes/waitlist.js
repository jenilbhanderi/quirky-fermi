const express = require('express');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');
const { waitlistLimiter } = require('../middleware/rateLimiter');
const { statements } = require('../db/database');
const { sendWaitlistConfirmation } = require('../services/emailService');

const router = express.Router();

// ─── POST /api/waitlist ─────────────────────────────────────
// Public — submit email to waitlist
router.post(
  '/',
  waitlistLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('A valid email address is required.')
      .normalizeEmail(),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      // Check for duplicate
      const existing = statements.getWaitlistByEmail.get(email);
      if (existing) {
        return res.status(409).json({
          error: 'This email is already on the waitlist.',
          alreadyExists: true,
        });
      }

      // Insert into database
      const result = statements.insertWaitlist.run(email, ip);

      // Send confirmation email (non-blocking — errors won't fail the response)
      sendWaitlistConfirmation(email).catch(() => {});

      res.status(201).json({
        message: 'Access request received. We will be in touch.',
        id: result.lastInsertRowid,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
