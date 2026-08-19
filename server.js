const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./backend/routes/auth');
const topicRoutes   = require('./backend/routes/topics');
const sessionRoutes = require('./backend/routes/sessions');
const resultRoutes  = require('./backend/routes/results');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth',     authRoutes);
app.use('/api/topics',   topicRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/results',  resultRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   PrepAI Mock Interview Server       ║');
  console.log(`║   http://localhost:${PORT}               ║`);
  console.log('╚══════════════════════════════════════╝\n');
});