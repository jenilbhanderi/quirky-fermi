const express = require('express');
const { statements } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/papers ────────────────────────────────────────
// Public — fetch all research papers (abstracts only or full depending on need, we fetch full for simplicity)
router.get('/', (req, res, next) => {
  try {
    const papers = statements.getAllPapers.all();
    res.json(papers);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/papers/:slug ──────────────────────────────────
// Public — fetch a single paper by its slug
router.get('/:slug', (req, res, next) => {
  try {
    const slug = req.params.slug;
    const paper = statements.getPaperBySlug.get(slug);
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found.' });
    }
    
    res.json(paper);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/papers ───────────────────────────────────────
// Protected — create a new research paper
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const { title, abstract, content, authors, category, color } = req.body;
    
    if (!title || !abstract) {
      return res.status(400).json({ error: 'Title and abstract are required.' });
    }
    
    // Generate a URL-friendly slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
      
    // Check if slug exists
    const existing = statements.getPaperBySlug.get(slug);
    if (existing) {
      return res.status(409).json({ error: 'A paper with a similar title already exists.' });
    }
    
    const result = statements.insertPaper.run(
      slug,
      title,
      abstract,
      content || '',
      authors || '',
      category || 'Research',
      color || 'from-blue-500 to-purple-500'
    );
    
    res.status(201).json({
      message: 'Paper created successfully.',
      id: result.lastInsertRowid,
      slug
    });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/papers/:id ─────────────────────────────────
// Protected — delete a research paper
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID.' });
    }

    const paper = statements.getPaperById.get(id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    statements.deletePaperById.run(id);

    res.json({ message: 'Paper deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
