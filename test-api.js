/**
 * Quick API test script — run with: node test-api.js
 */

const BASE = 'http://localhost:3001/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function get(path, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { headers });
  const data = await res.json();
  return { status: res.status, data };
}

async function del(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function run() {
  console.log('═══════════════════════════════════════════');
  console.log('  Hylunian Backend API — Test Suite');
  console.log('═══════════════════════════════════════════\n');

  // 1. Health check
  console.log('1️⃣  Health Check');
  const health = await get('/health');
  console.log(`   Status: ${health.status} — ${JSON.stringify(health.data)}\n`);

  // 2. Waitlist signup
  console.log('2️⃣  Waitlist Signup');
  const signup = await post('/waitlist', { email: 'test@hylunian.com' });
  console.log(`   Status: ${signup.status} — ${JSON.stringify(signup.data)}\n`);

  // 3. Duplicate signup (should 409)
  console.log('3️⃣  Duplicate Signup (expect 409)');
  const dupe = await post('/waitlist', { email: 'test@hylunian.com' });
  console.log(`   Status: ${dupe.status} — ${JSON.stringify(dupe.data)}\n`);

  // 4. Invalid email (should 400)
  console.log('4️⃣  Invalid Email (expect 400)');
  const invalid = await post('/waitlist', { email: 'not-an-email' });
  console.log(`   Status: ${invalid.status} — ${JSON.stringify(invalid.data)}\n`);

  // 5. Admin register
  console.log('5️⃣  Admin Register');
  const reg = await post('/auth/register', {
    username: 'testadmin',
    password: 'secure-password-123',
    inviteCode: 'hylunian-alpha-2026',
  });
  console.log(`   Status: ${reg.status} — ${JSON.stringify(reg.data)}\n`);

  const token = reg.data.token;

  // 6. Admin login
  console.log('6️⃣  Admin Login');
  const login = await post('/auth/login', {
    username: 'testadmin',
    password: 'secure-password-123',
  });
  console.log(`   Status: ${login.status} — ${JSON.stringify(login.data)}\n`);

  // 7. Get waitlist (admin)
  console.log('7️⃣  Get Waitlist (Admin)');
  const list = await get('/admin/waitlist', token);
  console.log(`   Status: ${list.status} — ${JSON.stringify(list.data)}\n`);

  // 8. Get waitlist stats
  console.log('8️⃣  Waitlist Stats');
  const stats = await get('/admin/waitlist/stats', token);
  console.log(`   Status: ${stats.status} — ${JSON.stringify(stats.data)}\n`);

  // 9. Unauthorized access (no token)
  console.log('9️⃣  Unauthorized Access (expect 401)');
  const noAuth = await get('/admin/waitlist');
  console.log(`   Status: ${noAuth.status} — ${JSON.stringify(noAuth.data)}\n`);

  // 10. Wrong invite code
  console.log('🔟 Wrong Invite Code (expect 403)');
  const badCode = await post('/auth/register', {
    username: 'hacker',
    password: 'password123',
    inviteCode: 'wrong-code',
  });
  console.log(`   Status: ${badCode.status} — ${JSON.stringify(badCode.data)}\n`);

  console.log('═══════════════════════════════════════════');
  console.log('  ✅ All tests completed!');
  console.log('═══════════════════════════════════════════\n');
}

run().catch(console.error);
