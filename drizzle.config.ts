import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({
    path: '.env.local',
  });
export default defineConfig({
  schema: "./app/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString:
    process.env.DRIZZLE_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
