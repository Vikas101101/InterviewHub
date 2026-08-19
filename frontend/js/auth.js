function showAuthMsg(msg, type = 'error') {
  const el = document.getElementById('auth-msg');
  el.textContent  = msg;
  el.className    = `auth-msg ${type}`;
  el.classList.remove('hidden');
}
function hideAuthMsg() { document.getElementById('auth-msg').classList.add('hidden'); }

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    hideAuthMsg();
  });
});

async function doLogin() {
  const email = document.getElementById('li-email').value.trim();
  const pass  = document.getElementById('li-pass').value;
  if (!email || !pass) { showAuthMsg('Please enter email and password.'); return; }
  try {
    const d = await API.login({ email, password: pass });
    onAuth(d);
  } catch (e) { showAuthMsg(e.message); }
}

async function doRegister() {
  const name  = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim();
  const pass  = document.getElementById('rg-pass').value;
  if (!name || !email || !pass) { showAuthMsg('All fields are required.'); return; }
  if (pass.length < 6) { showAuthMsg('Password must be at least 6 characters.'); return; }
  try {
    const d = await API.register({ name, email, password: pass });
    onAuth(d);
  } catch (e) { showAuthMsg(e.message); }
}

function onAuth(data) {
  console.log('onAuth called with:', data);
  if (!data || !data.token) {
    showAuthMsg('Login failed. Please try again.');
    return;
  }
  localStorage.setItem('ih_token', data.token);
  localStorage.setItem('ih_user', JSON.stringify(data.user));
  currentUser = data.user;
  console.log('Token saved:', localStorage.getItem('ih_token'));
  launchApp();
}

function doLogout() {
  localStorage.removeItem('ih_token');
  localStorage.removeItem('ih_user');
  currentUser = null;
  stopTimer();
  document.getElementById('screen-auth').classList.add('active');
  document.getElementById('screen-auth').style.display = 'flex';
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-app').style.display  = 'none';
  document.getElementById('topbar').style.display = 'none';
}