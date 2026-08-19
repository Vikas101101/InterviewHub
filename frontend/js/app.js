var currentUser = null;

function toast(msg, type = '') {
  let el = document.getElementById('__toast');
  if (!el) { el = document.createElement('div'); el.id = '__toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.className   = 'toast' + (type?' '+type:'');
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `.toast{position:fixed;bottom:24px;right:24px;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:12px 20px;border-radius:12px;font-size:14px;z-index:9999;transform:translateY(80px);opacity:0;transition:all .35s cubic-bezier(.16,1,.3,1);pointer-events:none;font-family:var(--font)}.toast.show{transform:translateY(0);opacity:1}.toast.success{background:rgba(16,185,129,.1);color:#10b981;border-color:rgba(16,185,129,.2)}.toast.error{background:rgba(239,68,68,.1);color:#ef4444;border-color:rgba(239,68,68,.2)}`;
document.head.appendChild(toastStyle);

function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nl').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  const nl = document.querySelector(`.nl[data-page="${page}"]`);
  if (nl) nl.classList.add('active');
  closeSb();
  if (page === 'dashboard')    loadDashboard();
  else if (page === 'new')     { document.getElementById('step-topic').style.display='none'; document.getElementById('step-config').style.display='none'; renderLevelGrid(); }
  else if (page === 'history') loadHistory();
  else if (page === 'profile') loadProfile();
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSb()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sb-overlay').classList.add('show'); }
function closeSb() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sb-overlay').classList.remove('show'); }

function setUserUI() {
  if (!currentUser) return;
  const i = currentUser.name?.[0]?.toUpperCase() || 'U';
  const savedPic = localStorage.getItem('ih_profile_pic');

  // Sidebar avatar
  const sbAva = document.getElementById('sb-ava');
  if (savedPic) {
    sbAva.innerHTML = `<img src="${savedPic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
  } else {
    sbAva.textContent = i;
  }

  // Topbar avatar
  const tbAva = document.getElementById('tb-ava');
  if (savedPic) {
    tbAva.innerHTML = `<img src="${savedPic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
  } else {
    tbAva.textContent = i;
  }

  document.getElementById('sb-uname').textContent = currentUser.name.split(' ')[0];
  const h = new Date().getHours();
  document.getElementById('dash-hello').textContent = (h<12?'Good morning':h<17?'Good afternoon':'Good evening') + ', ' + currentUser.name.split(' ')[0] + '! 👋';
}

async function launchApp() {
  document.getElementById('screen-auth').classList.remove('active');
  document.getElementById('screen-auth').style.display = 'none';
  document.getElementById('screen-app').classList.add('active');
  document.getElementById('screen-app').style.display  = 'flex';
  document.getElementById('topbar').style.display = 'flex';
  setUserUI();
  await loadTopics();
  go('dashboard');
  scheduleDailyReminder();
}

function boot() {
  const token = localStorage.getItem('ih_token');
  const user  = localStorage.getItem('ih_user');
  if (token && user) {
    currentUser = JSON.parse(user);
    launchApp();
  } else {
    document.getElementById('screen-auth').classList.add('active');
    document.getElementById('screen-auth').style.display = 'flex';
    document.getElementById('topbar').style.display      = 'none';
  }
}

document.addEventListener('DOMContentLoaded', boot);

// ── Daily Practice Reminder ───────────────────────────────────
function scheduleDailyReminder() {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Show reminder every 24 hours
    const lastReminder = localStorage.getItem('ih_last_reminder');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastReminder || (now - parseInt(lastReminder)) > oneDay) {
      setTimeout(() => {
        new Notification('InterviewHub Reminder! 🎯', {
          body: 'Time to practice! Keep your interview skills sharp.',
          icon: '/images/app_logo.jpeg',
          badge: '/images/app_logo.jpeg',
        });
        localStorage.setItem('ih_last_reminder', Date.now().toString());
      }, 5000);
    }
  }
}