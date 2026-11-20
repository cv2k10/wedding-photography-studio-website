const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) throw new Error('Set the CLOUDFLARE_API_TOKEN Actions secret.');

async function call(path, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(`Cloudflare ${options.method ?? 'GET'} ${path} failed (${response.status}): ${body.errors?.map(({ message }) => message).join('; ') ?? 'Unknown error'}`);
  }
  return body;
}

let account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!account) {
  const { result, result_info: info } = await call('/accounts?page=1&per_page=5');
  if (result.length !== 1 || (info?.total_count ?? 1) > 1 || (info?.total_pages ?? 1) > 1) {
    throw new Error('The token must see exactly one Cloudflare account for automatic selection. Otherwise set CLOUDFLARE_ACCOUNT_ID explicitly.');
  }
  account = result[0].id;
}
if (!/^[a-f0-9]{32}$/i.test(account)) throw new Error('Invalid Cloudflare account ID.');
console.log(`Using Cloudflare account ${account}`);

let database = process.env.D1_DATABASE_ID;
if (!database) {
  const name = 'wedding-studio';
  const path = `/accounts/${account}/d1/database`;
  const { result } = await call(`${path}?name=${encodeURIComponent(name)}`);
  const existing = result.find((item) => item.name === name);
  const selected = existing ?? (await call(path, { method: 'POST', body: JSON.stringify({ name }) })).result;
  database = selected.uuid;
  console.log(`${existing ? 'Reusing' : 'Created'} D1 database ${name}: ${database}`);
}

const { appendFileSync } = await import('node:fs');
if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(database ?? '')) throw new Error('Invalid D1 database ID.');
appendFileSync(process.env.GITHUB_ENV, `CLOUDFLARE_ACCOUNT_ID=${account}\nD1_DATABASE_ID=${database}\n`);
