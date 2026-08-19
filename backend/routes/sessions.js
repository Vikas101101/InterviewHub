const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB }   = require('../middleware/db');
const { authMiddleware }    = require('../middleware/auth');
const questions             = require('../data/questions');
const { evaluateAnswer, getGrade } = require('../data/evaluator');

const router = express.Router();

// POST /api/sessions/start
router.post('/start', authMiddleware, (req, res) => {
  try {
    const { topic, level, count = 5 } = req.body;
    if (!topic || !level) return res.status(400).json({ error: 'Topic and experience level are required.' });

    const pool = questions[topic]?.[level] || [];
    if (!pool.length) return res.status(400).json({ error: 'No questions found for this topic + level combo.' });

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const session = {
      id:        uuidv4(),
      userId:    req.user.id,
      topic, level,
      questions: selected,
      answers:   [],
      status:    'active',
      startedAt: new Date().toISOString(),
      total:     selected.length
    };

    const db = readDB();
    db.sessions.push(session);
    writeDB(db);

    res.json({ sessionId: session.id, questions: session.questions, total: session.total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/answer
router.post('/:id/answer', authMiddleware, (req, res) => {
  try {
    const db      = readDB();
    const session = db.sessions.find(s => s.id === req.params.id && s.userId === req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    const { questionIndex, answer, timeTaken } = req.body;
    const q = session.questions[questionIndex];
    if (!q) return res.status(400).json({ error: 'Invalid question index.' });

    const evaluation = evaluateAnswer(answer, q);

    session.answers[questionIndex] = {
      questionIndex, answer, timeTaken,
      score:    evaluation.score,
      feedback: evaluation.feedback,
      keywords: evaluation.keywords,
      answeredAt: new Date().toISOString()
    };

    writeDB(db);
    res.json({ evaluation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/finish
router.post('/:id/finish', authMiddleware, (req, res) => {
  try {
    const db      = readDB();
    const session = db.sessions.find(s => s.id === req.params.id && s.userId === req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    session.status     = 'completed';
    session.finishedAt = new Date().toISOString();

    const answered   = session.answers.filter(Boolean);
    const totalScore = answered.reduce((s, a) => s + (a.score || 0), 0);
    const avgScore   = answered.length ? Math.round(totalScore / answered.length) : 0;
    const timeTaken  = Math.round((new Date(session.finishedAt) - new Date(session.startedAt)) / 1000);

    const result = {
      id:            uuidv4(),
      sessionId:     session.id,
      userId:        req.user.id,
      topic:         session.topic,
      level:         session.level,
      totalQ:        session.total,
      answeredCount: answered.length,
      avgScore,
      grade:         getGrade(avgScore),
      questions:     session.questions,
      answers:       session.answers,
      timeTaken,
      completedAt:   new Date().toISOString()
    };

    db.results.push(result);
    writeDB(db);

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
