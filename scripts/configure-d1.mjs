import { readFileSync, writeFileSync } from 'node:fs';

const path = 'wrangler.jsonc';
const config = readFileSync(path, 'utf8');
const zero = '00000000-0000-0000-0000-000000000000';
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const binding = /("database_id"\s*:\s*")([^"\r\n]+)(")/;
const existing = config.match(binding)?.[2];
const databaseId = process.env.D1_DATABASE_ID || existing;
if (!existing || !databaseId || !uuid.test(databaseId) || databaseId === zero) {
  throw new Error('Set the CLOUDFLARE_D1_DATABASE_ID Actions variable to the production D1 UUID, or configure database_id in wrangler.jsonc.');
}
writeFileSync(path, config.replace(binding, (_, key, _value, end) => key + databaseId + end));
