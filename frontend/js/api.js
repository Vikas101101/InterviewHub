const BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('ih_token');

async function req(method, url, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(BASE + url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const API = {
  register:      d     => req('POST', '/auth/register', d),
  login:         d     => req('POST', '/auth/login', d),
  topics:        ()    => req('GET',  '/topics'),
  startSession:  d     => req('POST', '/sessions/start', d),
  submitAnswer:  (id,d)=> req('POST', `/sessions/${id}/answer`, d),
  finishSession: id    => req('POST', `/sessions/${id}/finish`),
  results:       ()    => req('GET',  '/results'),
  resultStats:   ()    => req('GET',  '/results/stats'),
  result:        id    => req('GET',  `/results/${id}`),
  deleteResult: id => req('DELETE', `/results/${id}`),
};