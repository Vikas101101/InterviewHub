const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../middleware/db');
const { JWT_SECRET }      = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const db = readDB();
    if (db.users.find(u => u.email === email))
      return res.status(409).json({ error: 'Email is already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(), name, email,
      password: hashed,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const db   = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'No account found with that email.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
