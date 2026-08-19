const express = require('express');
const router  = express.Router();
const questions = require('../data/questions');

// GET /api/topics
router.get('/', (req, res) => {
  res.json({
    experienceLevels: [
  { id: 'fresher',  label: 'Level 1 : Fresher',           years: '0-1 Year',  icon: '🌱', color: '#34d399', desc: 'Campus recruits & fresh graduates' },
  { id: '1year',    label: 'Level 2 : Junior Developer',  years: '1-2 Year',  icon: '⚡', color: '#60a5fa', desc: 'Junior devs with 1-2 years hands-on' },
  { id: '2years',   label: 'Level 3 : Mid-Level Developer', years: '2-3 Year', icon: '🔥', color: '#f59e0b', desc: 'Developers with solid project work' },
  { id: '3years',   label: 'Level 4 : Senior Developer',  years: '3-4 Year',  icon: '🚀', color: '#a78bfa', desc: 'Senior engineers leading modules' },
  { id: '5plus',    label: 'Level 5 : Lead Developer',    years: '5+ Year',   icon: '🏆', color: '#f97316', desc: 'Tech leads & principal engineers' },
],
    topics: [
      { id: 'javascript',     label: 'JavaScript',      icon: '⚡', color: '#f7df1e' },
      { id: 'python',         label: 'Python',           icon: '🐍', color: '#3776ab' },
      { id: 'java',           label: 'Java',             icon: '☕', color: '#e76f00' },
      { id: 'cpp',            label: 'C / C++',          icon: '⚙️', color: '#6b9cd8' },
      { id: 'react',          label: 'React',            icon: '⚛️', color: '#61dafb' },
      { id: 'nodejs',         label: 'Node.js',          icon: '🟢', color: '#68a063' },
      { id: 'typescript',     label: 'TypeScript',       icon: '🔷', color: '#3178c6' },
      { id: 'sql',            label: 'SQL & Databases',  icon: '🗄️', color: '#ff9f43' },
      { id: 'mongodb',        label: 'MongoDB',          icon: '🍃', color: '#4db33d' },
      { id: 'dsa',            label: 'DSA',              icon: '🧮', color: '#a78bfa' },
      { id: 'system_design',  label: 'System Design',    icon: '🏗️', color: '#ff6b6b' },
      { id: 'devops',         label: 'DevOps & Docker',  icon: '🐳', color: '#0db7ed' },
      { id: 'git',            label: 'Git & GitHub',     icon: '🌿', color: '#f05032' },
      { id: 'os',             label: 'OS & Networking',  icon: '🖥️', color: '#9ca3af' },
      { id: 'hr',             label: 'HR & Behavioral',  icon: '🤝', color: '#34d399' },
    ],
    // Return question counts per topic+level combo
    counts: Object.keys(questions).reduce((acc, topic) => {
      acc[topic] = {};
      ['fresher','1year','2years','3years','5plus'].forEach(lvl => {
        acc[topic][lvl] = (questions[topic]?.[lvl] || []).length;
      });
      return acc;
    }, {})
  });
});

module.exports = router;
