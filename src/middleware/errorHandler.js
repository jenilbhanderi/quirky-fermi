/**
 * Centralized error handler — catches all unhandled errors.
 * Returns generic messages in production, detailed in development.
 */
function errorHandler(err, req, res, _next) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Unique constraint violation (SQLite or PostgreSQL)
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === '23505') {
    return res.status(409).json({ error: 'This resource already exists.' });
  }

  // Generic constraint violation
  if ((err.code && err.code.startsWith('SQLITE_CONSTRAINT')) || (err.code && err.code.startsWith('23'))) {
    return res.status(400).json({ error: 'Database constraint violation.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
}

module.exports = errorHandler;
