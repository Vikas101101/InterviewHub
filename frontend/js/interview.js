// ── Interview State ───────────────────────────────────────────────
let session   = null;
let questions = [];
let qIndex    = 0;
let timerInt  = null;
let timerSec  = 0;

let selLevel  = null;
let selTopic  = null;
let selCount  = 5;
let topicsData = { topics: [], experienceLevels: [], counts: {} };

// ── Load Topics ───────────────────────────────────────────────────
async function loadTopics() {
  try {
    topicsData = await API.topics();
    renderLevelGrid();
  } catch { toast('Could not load topics.', 'error'); }
}

// ── Step 1: Experience Level ──────────────────────────────────────
function renderLevelGrid() {
  const g = document.getElementById('level-grid');
  g.innerHTML = topicsData.experienceLevels.map(lv => `
    <div class="lvl-card ${selLevel === lv.id ? 'selected' : ''}"
      onclick="selectLevel('${lv.id}', this)"
      style="${selLevel===lv.id?`border-color:${lv.color};box-shadow:0 0 0 1px ${lv.color},0 8px 28px ${lv.color}22`:''}">
      <div class="lvl-icon">${lv.icon}</div>
      <div class="lvl-name">${lv.label}</div>
      <div class="lvl-years" style="color:${lv.color}">${lv.years}</div>
      <div class="lvl-desc">${lv.desc}</div>
    </div>`).join('');
}

function selectLevel(id, el) {
  selLevel = id;
  selTopic = null;
  document.querySelectorAll('.lvl-card').forEach(c => {
    c.classList.remove('selected');
    c.style.borderColor = '';
    c.style.boxShadow   = '';
  });
  const lv = topicsData.experienceLevels.find(l => l.id === id);
  el.classList.add('selected');
  el.style.borderColor = lv?.color || 'var(--acc)';
  el.style.boxShadow   = `0 0 0 1px ${lv?.color||'var(--acc)'},0 8px 28px ${lv?.color||'var(--acc)'}22`;

  // Reveal step 2
  document.getElementById('step-topic').style.display = 'block';
  document.getElementById('step-config').style.display = 'none';
  renderTopicGrid();
  document.getElementById('step-topic').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Step 2: Topic ─────────────────────────────────────────────────
const ICONS = { javascript:'⚡', python:'🐍', java:'☕', cpp:'⚙️', react:'⚛️', nodejs:'🟢', typescript:'🔷', sql:'🗄️', mongodb:'🍃', dsa:'🧮', system_design:'🏗️', devops:'🐳', git:'🌿', os:'🖥️', hr:'🤝' };

function renderTopicGrid(filter = '') {
  const g = document.getElementById('topic-grid');
  const f = filter.toLowerCase();
  g.innerHTML = topicsData.topics.map(t => {
    const count = topicsData.counts?.[t.id]?.[selLevel] || 0;
    const avail = count > 0;
    if (f && !t.label.toLowerCase().includes(f) && !t.id.includes(f)) return '';
    return `
      <div class="tc-card ${selTopic===t.id?'selected':''} ${!avail?'dimmed':''}"
        onclick="${avail?`selectTopic('${t.id}',this)`:''}">
        <div class="tc-icon">${t.icon}</div>
        <div class="tc-name">${t.label}</div>
        <div class="tc-count">${count} question${count!==1?'s':''}</div>
        <span class="tc-avail ${avail?'yes':'no'}">${avail?'Available':'No questions'}</span>
      </div>`;
  }).join('');
}

function filterTopics(val) { renderTopicGrid(val); }

function selectTopic(id, el) {
  selTopic = id;
  document.querySelectorAll('.tc-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const t  = topicsData.topics.find(x => x.id === id);
  const lv = topicsData.experienceLevels.find(x => x.id === selLevel);
  const cnt = topicsData.counts?.[id]?.[selLevel] || 0;

  document.getElementById('cfg-label').textContent = t?.label || id;
  updateCfgSummary(t, lv, cnt);

  document.getElementById('step-config').style.display = 'block';
  document.getElementById('step-config').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCfgSummary(t, lv, cnt) {
  document.getElementById('cfg-summary').innerHTML = `
    <strong>Topic:</strong> ${t?.label || selTopic}<br/>
    <strong>Level:</strong> ${lv?.icon || ''} ${lv?.label || selLevel}<br/>
    <strong>Available:</strong> ${cnt} question${cnt!==1?'s':''}<br/>
    <strong>Selected:</strong> ${selCount} question${selCount!==1?'s':''}`;
}

function backToTopics() {
  document.getElementById('step-config').style.display = 'none';
  selTopic = null;
  document.querySelectorAll('.tc-card').forEach(c => c.classList.remove('selected'));
}

// Pill counts
document.getElementById('pills-count')?.addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (!p) return;
  document.querySelectorAll('#pills-count .pill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  selCount = parseInt(p.dataset.v);
  const t  = topicsData.topics.find(x => x.id === selTopic);
  const lv = topicsData.experienceLevels.find(x => x.id === selLevel);
  const cnt = topicsData.counts?.[selTopic]?.[selLevel] || 0;
  updateCfgSummary(t, lv, cnt);
});

// ── Start Session ─────────────────────────────────────────────────
async function startSession() {
  if (!selLevel || !selTopic) { toast('Please select a level and topic first.', 'error'); return; }
  try {
    const d = await API.startSession({ topic: selTopic, level: selLevel, count: selCount });
    session   = { id: d.sessionId, topic: selTopic, level: selLevel };
    questions = d.questions;
    qIndex    = 0;
    timerSec  = 0;
    showPage('interview');
    renderQ(0);
    startTimer();
  } catch (e) { toast(e.message, 'error'); }
}

// ── Render Question ───────────────────────────────────────────────
function renderQ(idx) {
  const q = questions[idx];
  if (!q) return;
  const total = questions.length;
  const pct   = Math.round((idx / total) * 100);

  document.getElementById('int-badge').textContent = selTopic.replace('_',' ').toUpperCase();
  document.getElementById('int-lvl').textContent   = topicsData.experienceLevels.find(l=>l.id===selLevel)?.label || selLevel;
  document.getElementById('int-prog').textContent  = `${idx+1} / ${total}`;
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('qnum').textContent      = `Q${idx+1}`;
  document.getElementById('qtext').textContent     = q.q;
  document.getElementById('qdiff').textContent     = q.difficulty;
  document.getElementById('qdiff').className       = `qdiff ${q.difficulty}`;
  document.getElementById('qtopic').textContent    = q.topic;
  document.getElementById('ans-input').value       = '';
  document.getElementById('wc').textContent        = '0 words';
  document.getElementById('fb-panel').classList.add('hidden');
  document.getElementById('btn-submit').disabled   = false;
  document.getElementById('btn-submit').textContent = 'Submit Answer →';
  document.getElementById('ans-input').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('ans-input')?.addEventListener('input', e => {
  const w = e.target.value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('wc').textContent = w + ' word' + (w!==1?'s':'');
});

// ── Submit Answer ─────────────────────────────────────────────────
async function submitAns() {
  const answer = document.getElementById('ans-input').value.trim();
  if (!answer) { toast('Write your answer first!', 'error'); return; }
  const btn = document.getElementById('btn-submit');
  btn.disabled    = true;
  btn.textContent = 'Evaluating…';
  try {
    const d = await API.submitAnswer(session.id, { questionIndex: qIndex, answer, timeTaken: timerSec });
    showFeedback(d.evaluation, qIndex);
  } catch (e) {
    toast(e.message, 'error');
    btn.disabled    = false;
    btn.textContent = 'Submit Answer →';
  }
}

function showFeedback(ev, idx) {
  const panel = document.getElementById('fb-panel');
  panel.classList.remove('hidden');

  const arc  = document.getElementById('donut-arc');
  const val  = document.getElementById('donut-val');
  const circ = 163.36;
  const off  = circ - (ev.score / 100) * circ;
  const color = ev.score >= 70 ? 'var(--acc2)' : ev.score >= 45 ? 'var(--acc)' : 'var(--danger)';
  arc.style.stroke          = color;
  arc.style.strokeDashoffset = off;
  val.textContent           = ev.score;
  val.style.color           = color;

  document.getElementById('fb-text').textContent = ev.feedback;

  const kw = document.getElementById('kw-row');
  kw.innerHTML = ev.keywords?.length
    ? ev.keywords.map(k => `<span class="kw">✓ ${k}</span>`).join('')
    : '';

  const isLast = qIndex >= questions.length - 1;
  document.getElementById('btn-next').textContent = isLast ? 'Finish Interview 🏁' : 'Next Question →';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function nextQ() {
  if (qIndex >= questions.length - 1) {
    await finishSess();
  } else {
    qIndex++;
    renderQ(qIndex);
  }
}

// ── Finish Session ────────────────────────────────────────────────
async function finishSess() {
  stopTimer();
  try {
    const d = await API.finishSession(session.id);
    renderResult(d.result);
    showPage('result');
  } catch (e) { toast(e.message, 'error'); }
}

function renderResult(r) {
  const g = r.grade || {};
  const arc   = document.getElementById('grade-arc');
  const circ  = 263.9;
  const off   = circ - (r.avgScore / 100) * circ;
  arc.style.stroke          = g.color || 'var(--acc)';
  arc.style.strokeDashoffset = off;

  document.getElementById('grade-ltr').textContent = g.letter || '?';
  document.getElementById('grade-ltr').style.color = g.color || 'var(--acc)';
  document.getElementById('res-title').textContent  = g.label ? g.label + ' Performance!' : 'Interview Complete!';
  document.getElementById('res-sub').textContent    =
    `You scored ${r.avgScore}% on ${r.topic.replace('_',' ')} — ${r.answeredCount}/${r.totalQ} answered.`;

  const lv = topicsData.experienceLevels.find(l => l.id === r.level);
  document.getElementById('res-stats').innerHTML = `
    <div class="rs-card"><div class="rs-val">${r.avgScore}%</div><div class="rs-lbl">Avg Score</div></div>
    <div class="rs-card"><div class="rs-val">${r.answeredCount}/${r.totalQ}</div><div class="rs-lbl">Answered</div></div>
    <div class="rs-card"><div class="rs-val">${fmtSec(r.timeTaken)}</div><div class="rs-lbl">Time</div></div>
    <div class="rs-card"><div class="rs-val">${lv?.icon||''}${lv?.label||r.level}</div><div class="rs-lbl">Level</div></div>
  `;

  document.getElementById('breakdown').innerHTML = r.questions.map((q,i) => {
    const ans   = r.answers[i];
    const score = ans?.score ?? 0;
    const col   = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
    return `<div class="bd-item">
      <div class="bd-top">
        <div class="bd-q">Q${i+1}: ${q.q}</div>
        <div class="bd-score" style="color:${col}">${score}%</div>
      </div>
      <div class="bd-bar-wrap"><div class="bd-bar" style="width:${score}%;background:${col}"></div></div>
      <div class="bd-ans"><strong>Your answer:</strong> ${ans?.answer || '<em>Not answered</em>'}</div>
      ${ans?.feedback ? `<div class="bd-fb">${ans.feedback}</div>` : ''}
    </div>`;
  }).join('');
}

// ── Timer ─────────────────────────────────────────────────────────
function startTimer() {
  stopTimer();
  timerSec = 0;
  timerInt = setInterval(() => {
    timerSec++;
    const m = Math.floor(timerSec/60).toString().padStart(2,'0');
    const s = (timerSec%60).toString().padStart(2,'0');
    const el = document.getElementById('int-timer');
    if (el) { el.textContent = `${m}:${s}`; el.classList.toggle('warn', timerSec > 1800); }
  }, 1000);
}
function stopTimer() { if (timerInt) { clearInterval(timerInt); timerInt = null; } }
function fmtSec(s) { if (!s) return '—'; const m=Math.floor(s/60); return m>0?`${m}m ${s%60}s`:`${s}s`; }
