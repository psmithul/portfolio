import { env } from 'cloudflare:workers';

export function getDb(): D1Database {
  if (!env.DB)
    throw new Error(
      'Journal database is unavailable. Configure the DB binding and apply the migrations.',
    );
  return env.DB;
}
