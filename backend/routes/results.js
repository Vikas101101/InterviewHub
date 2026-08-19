const express = require('express');
const { readDB, writeDB } = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/results  — all for current user
router.get('/', authMiddleware, (req, res) => {
  const db      = readDB();
  const results = db.results
    .filter(r => r.userId === req.user.id)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  res.json({ results });
});

// GET /api/results/stats
router.get('/stats', authMiddleware, (req, res) => {
  const db      = readDB();
  const results = db.results.filter(r => r.userId === req.user.id);

  // Per-topic stats
  const byTopic = {};
  results.forEach(r => {
    if (!byTopic[r.topic]) byTopic[r.topic] = { count: 0, total: 0 };
    byTopic[r.topic].count++;
    byTopic[r.topic].total += r.avgScore;
  });
  const topicStats = Object.entries(byTopic).map(([topic, d]) => ({
    topic, attempts: d.count, avgScore: Math.round(d.total / d.count)
  }));

  // Per-level stats
  const byLevel = {};
  results.forEach(r => {
    if (!byLevel[r.level]) byLevel[r.level] = { count: 0, total: 0 };
    byLevel[r.level].count++;
    byLevel[r.level].total += r.avgScore;
  });
  const levelStats = Object.entries(byLevel).map(([level, d]) => ({
    level, attempts: d.count, avgScore: Math.round(d.total / d.count)
  }));

  const overallAvg = results.length
    ? Math.round(results.reduce((s, r) => s + r.avgScore, 0) / results.length)
    : 0;

  res.json({
    total: results.length,
    overallAvg,
    topicStats,
    levelStats,
    recent: results.slice(0, 6)
  });
});

// GET /api/results/:id
router.get('/:id', authMiddleware, (req, res) => {
  const db  = readDB();
  const r   = db.results.find(x => x.id === req.params.id && x.userId === req.user.id);
  if (!r) return res.status(404).json({ error: 'Result not found.' });
  res.json({ result: r });
});

// DELETE /api/results/:id
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const index = db.results.findIndex(x => x.id === req.params.id && x.userId === req.user.id);
    if (index === -1) return res.status(404).json({ error: 'Result not found.' });
    db.results.splice(index, 1);
    writeDB(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
