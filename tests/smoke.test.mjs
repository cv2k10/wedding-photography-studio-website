import assert from 'node:assert/strict';
import test from 'node:test';

const base = new URL(process.env.TEST_BASE_URL ?? 'http://localhost:8787');
const request = (path, options) => fetch(new URL(path, base), { redirect: 'manual', ...options });
const form = (path, data, cookie, origin = base.origin) => request(path, {
  method: 'POST', body: new URLSearchParams(data), headers: { origin, ...(cookie ? { cookie } : {}) },
});
const booking = { coupleName: 'Worker smoke test', phone: '123456789', weddingDate: '2028-06-15' };
const api = (body) => request('/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body });

test('public pages, CSS, and migrated D1 health', async () => {
  for (const path of ['/', '/about', '/packages', '/portfolio?cat=all', '/booking']) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /href="\/styles.css"/);
  }
  assert.equal((await request('/styles.css')).status, 200);
  assert.deepEqual(await (await request('/api/health')).json(), { ok: true });
  assert.equal((await request('/missing')).status, 404);
});

test('validates bookings and stores JSON and HTML submissions in D1', async () => {
  assert.equal((await api('{')).status, 400);
  assert.equal((await api('{}')).status, 422);
  assert.equal((await api(JSON.stringify({ ...booking, packageId: '9000000' }))).status, 422);
  const created = await api(JSON.stringify(booking));
  assert.equal(created.status, 201);
  assert.ok(Number.isInteger((await created.json()).id));
  const submitted = await form('/booking', booking);
  assert.equal(submitted.status, 200);
  assert.match(await submitted.text(), /预约提交成功/);
});

test('admin login, cross-origin protection, and status update', { skip: !process.env.TEST_ADMIN_PASSWORD }, async () => {
  const loginPage = await request('/admin');
  assert.equal(loginPage.headers.get('cache-control'), 'no-store');
  assert.equal((await form('/admin/login', { password: 'wrong' })).headers.get('location'), '/admin?error=1');
  const login = await form('/admin/login', { password: process.env.TEST_ADMIN_PASSWORD });
  assert.equal(login.status, 303);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const { id } = await (await api(JSON.stringify(booking))).json();
  assert.equal((await form('/admin/status', { id, status: 'booked' }, cookie, 'https://other.example')).status, 403);
  assert.equal((await form('/admin/status', { id, status: 'booked' }, cookie)).status, 303);
  const list = await request('/admin?status=booked', { headers: { cookie } });
  assert.match(await list.text(), new RegExp(`name="id" value="${id}"`));
  const logout = await form('/admin/logout', {}, cookie);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});
