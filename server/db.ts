import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/db-schema';

if (!process.env.DATABASE_URL) {
  console.warn('[WARNING] DATABASE_URL not set, using fallback mode');
}

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db && process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  }
  return db;
}

export { schema };
