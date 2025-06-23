import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './local.db',
  },
});
