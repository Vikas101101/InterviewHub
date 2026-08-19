// ── Dashboard ─────────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const d = await API.resultStats();
    renderDashStats(d);
    renderTopicPerf(d.topicStats);
    renderRecent(d.recent);
  } catch { renderDashStats({}); }
}

function renderDashStats(d) {
  const ts = d.topicStats || [];
  const best = ts.length ? ts.reduce((a,b) => a.avgScore>b.avgScore?a:b, ts[0]) : null;
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card"><div class="sc-icon"><img src="images/sessions.jpeg" style="width:32px;height:32px;object-fit:contain;border-radius:6px;"/></div><div class="sc-val">${d.total||0}</div><div class="sc-lbl">Sessions</div></div>
    <div class="stat-card"><div class="sc-icon"><img src="images/average_score.jpeg" style="width:32px;height:32px;object-fit:contain;border-radius:6px;"/></div><div class="sc-val">${d.overallAvg||0}%</div><div class="sc-lbl">Avg Score</div></div>
    <div class="stat-card"><div class="sc-icon"><img src="images/best_topic.jpeg" style="width:32px;height:32px;object-fit:contain;border-radius:6px;"/></div><div class="sc-val">${best?cap(best.topic.replace('_',' ')):'—'}</div><div class="sc-lbl">Best Topic</div></div>
    <div class="stat-card"><div class="sc-icon"><img src="images/streak.jpeg" style="width:32px;height:32px;object-fit:contain;border-radius:6px;"/></div><div class="sc-val">${d.total||0}</div><div class="sc-lbl">Streak</div></div>
  `;
}

function renderTopicPerf(stats) {
  const w = document.getElementById('dash-perf');
  if (!stats?.length) { w.innerHTML = '<p style="color:var(--sub);font-size:13px">Complete sessions to see your performance here.</p>'; return; }
  w.innerHTML = stats.map(s => `
    <div class="perf-card">
      <div class="pc-icon">${ICONS[s.topic]||'📘'}</div>
      <div class="pc-info">
        <div class="pc-name">${cap(s.topic.replace('_',' '))}</div>
        <div class="pc-meta">${s.attempts} session${s.attempts>1?'s':''}</div>
        <div class="pc-bar"><div class="pc-fill" style="width:${s.avgScore}%"></div></div>
      </div>
      <div class="pc-score">${s.avgScore}%</div>
    </div>`).join('');
}

function renderRecent(results) {
  const w = document.getElementById('dash-recent');
  if (!results?.length) {
    w.innerHTML = `<div class="empty"><div class="empty-ico">🎯</div><p>No sessions yet. <a onclick="go('new')">Start your first interview!</a></p></div>`;
    return;
  }
  w.innerHTML = results.map(r => `
    <div class="rc-item">
      <div class="rc-ico">${ICONS[r.topic]||'📘'}</div>
      <div class="rc-info">
        <div class="rc-topic">${r.topic.replace('_',' ')}</div>
        <div class="rc-meta">${r.answeredCount}/${r.totalQ} Q · ${r.level} · ${fmtDate(r.completedAt)}</div>
      </div>
      <div>
        <div class="rc-score">${r.avgScore}%</div>
        <div class="rc-grade" style="background:${r.grade?.color}22;color:${r.grade?.color};border:1px solid ${r.grade?.color}44">${r.grade?.letter}</div>
      </div>
    </div>`).join('');
}

// ── History ───────────────────────────────────────────────────────
let allHistory = [];

async function loadHistory() {
  try {
    const d = await API.results();
    allHistory = d.results;
    buildHistFilters();
    renderHistory(allHistory);
  } catch { renderHistory([]); }
}

function buildHistFilters() {
  const topics = [...new Set(allHistory.map(r => r.topic))];
  document.getElementById('hist-filters').innerHTML =
    `<button class="fc active" data-f="all" onclick="histFilter('all',this)">All</button>` +
    topics.map(t => `<button class="fc" data-f="${t}" onclick="histFilter('${t}',this)">${cap(t.replace('_',' '))}</button>`).join('');
}

function histFilter(f, btn) {
  document.querySelectorAll('.fc').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHistory(f === 'all' ? allHistory : allHistory.filter(r => r.topic === f));
}

function renderHistory(results) {
  const w = document.getElementById('hist-list');
  if (!results.length) {
    w.innerHTML = '<div class="empty"><div class="empty-ico">📋</div><p>No history yet. Complete an interview to see results here.</p></div>';
    return;
  }
  w.innerHTML = results.map(r => `
    <div class="hi-item">
      <div class="hi-ico">${ICONS[r.topic]||'📘'}</div>
      <div class="hi-info">
        <div class="hi-topic">${r.topic.replace('_',' ')}</div>
        <div class="hi-meta">${r.answeredCount}/${r.totalQ} questions · ${fmtDate(r.completedAt)}</div>
        <span class="hi-level">${topicsData.experienceLevels.find(l=>l.id===r.level)?.icon||''} ${r.level}</span>
      </div>
      <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="hi-score">${r.avgScore}%</div>
        <div class="hi-grade" style="background:${r.grade?.color}22;color:${r.grade?.color}">${r.grade?.letter} — ${r.grade?.label}</div>
        <button onclick="deleteHistory('${r.id}')" style="padding:5px 12px;background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2);border-radius:8px;font-size:12px;font-weight:600;">🗑 Delete</button>
      </div>
    </div>`).join('');
}

// ── Profile ───────────────────────────────────────────────────────
async function loadProfile() {
  const u = currentUser;
  const saved = JSON.parse(localStorage.getItem('ih_profile') || '{}');

  const profAva = document.getElementById('prof-ava');
const savedPic = localStorage.getItem('ih_profile_pic');
if (savedPic) {
  profAva.innerHTML = `<img src="${savedPic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
} else {
  profAva.textContent = u?.name?.[0]?.toUpperCase() || 'U';
}
  document.getElementById('prof-name').textContent   = u?.name || '—';
  document.getElementById('prof-email').textContent  = u?.email || '—';
  document.getElementById('prof-since').textContent  = 'Member since ' + new Date(u?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  document.getElementById('prof-role').textContent   = saved.role     || 'Candidate';
  document.getElementById('prof-joined').textContent = saved.org      ? '🏢 ' + saved.org      : '';

  // Show extra info if saved
  const extraHtml = `
    ${saved.phone    ? `<div class="prof-extra"><span>📞</span> ${saved.phone}</div>`    : ''}
    ${saved.org      ? `<div class="prof-extra"><span>🏢</span> ${saved.org}</div>`      : ''}
    ${saved.location ? `<div class="prof-extra"><span>📍</span> ${saved.location}</div>` : ''}
    ${saved.role     ? `<div class="prof-extra"><span>💼</span> ${saved.role}</div>`     : ''}
  `;
  const extraEl = document.getElementById('prof-extra-info');
  if (extraEl) extraEl.innerHTML = extraHtml;

  try {
    const d = await API.resultStats();
    renderOverall(d);
    renderMastery(d.topicStats || []);
    renderLevelBreakdown(d.levelStats || []);
  } catch { }
}

function renderOverall(d) {
  document.getElementById('overall-stats').innerHTML = `
    <div class="perf-row"><span class="pr-lbl">Total Sessions</span><span class="pr-val">${d.total}</span></div>
    <div class="perf-row"><span class="pr-lbl">Average Score</span><span class="pr-val">${d.overallAvg}%</span></div>
    <div class="perf-row"><span class="pr-lbl">Topics Practiced</span><span class="pr-val">${d.topicStats?.length||0}</span></div>
    <div class="perf-row"><span class="pr-lbl">Levels Attempted</span><span class="pr-val">${d.levelStats?.length||0}</span></div>
  `;
}

function renderMastery(stats) {
  const w = document.getElementById('topic-mastery');
  if (!stats.length) { w.innerHTML = '<p style="color:var(--sub);font-size:13px">No data yet.</p>'; return; }
  w.innerHTML = stats.map(s => `
    <div class="mastery-item">
      <div class="mastery-top"><span>${ICONS[s.topic]||'📘'} ${cap(s.topic.replace('_',' '))}</span><span>${s.avgScore}%</span></div>
      <div class="mas-bar-w"><div class="mas-bar" style="width:${s.avgScore}%"></div></div>
    </div>`).join('');
}

function renderLevelBreakdown(stats) {
  const w = document.getElementById('level-breakdown');
  if (!stats.length) { w.innerHTML = '<p style="color:var(--sub);font-size:13px">No data yet.</p>'; return; }
  const lvlMap = {};
  topicsData.experienceLevels.forEach(l => lvlMap[l.id] = l);
  w.innerHTML = stats.map(s => {
    const lv = lvlMap[s.level] || {};
    return `<div class="level-row">
      <span class="lr-icon">${lv.icon||'⚡'}</span>
      <span class="lr-name">${lv.label||s.level}</span>
      <span class="lr-count">${s.attempts} session${s.attempts>1?'s':''}</span>
      <span class="lr-score">${s.avgScore}%</span>
    </div>`;
  }).join('');
}

// ── Helpers ───────────────────────────────────────────────────────
function cap(str) { return str.split(' ').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' '); }
function fmtDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }

async function deleteHistory(id) {
  if (!confirm('Are you sure you want to delete this result?')) return;
  try {
    await API.deleteResult(id);
    toast('Result deleted!', 'success');
    loadHistory();
  } catch (e) {
    toast(e.message, 'error');
  }
}

function openEditModal() {
  const u = currentUser;
  const saved = JSON.parse(localStorage.getItem('ih_profile') || '{}');
  document.getElementById('edit-name').value     = u?.name     || '';
  document.getElementById('edit-email').value    = u?.email    || '';
  document.getElementById('edit-phone').value    = saved.phone    || '';
  document.getElementById('edit-org').value      = saved.org      || '';
  document.getElementById('edit-location').value = saved.location || '';
  document.getElementById('edit-role').value     = saved.role     || '';

  // Show current profile pic in preview
  const preview = document.getElementById('edit-ava-preview');
  const savedPic = localStorage.getItem('ih_profile_pic');
  if (savedPic) {
    preview.innerHTML = `<img src="${savedPic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
  } else {
    preview.textContent = u?.name?.[0]?.toUpperCase() || 'U';
  }

  const modal = document.getElementById('edit-modal');
  modal.style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

function saveProfile() {
  const name     = document.getElementById('edit-name').value.trim();
  const phone    = document.getElementById('edit-phone').value.trim();
  const org      = document.getElementById('edit-org').value.trim();
  const location = document.getElementById('edit-location').value.trim();
  const role     = document.getElementById('edit-role').value.trim();

  if (!name) { toast('Name cannot be empty!', 'error'); return; }

  // Save profile pic if new one selected
  if (window._tempProfilePic) {
    localStorage.setItem('ih_profile_pic', window._tempProfilePic);
    window._tempProfilePic = null;
  }

  // Save extra details
  const profile = { phone, org, location, role };
  localStorage.setItem('ih_profile', JSON.stringify(profile));

  // Update name
  currentUser.name = name;
  localStorage.setItem('ih_user', JSON.stringify(currentUser));

  closeEditModal();
  setUserUI();
  loadProfile();
  toast('Profile updated successfully! 🎉', 'success');
}
function previewProfilePic(input) {
  const file = input.files[0];
  if (!file) return;

  // Check file size max 2MB
  if (file.size > 2 * 1024 * 1024) {
    toast('Image too large! Max size is 2MB.', 'error');
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('edit-ava-preview');
    preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
    // Store temporarily
    window._tempProfilePic = e.target.result;
  };
  reader.readAsDataURL(file);
}