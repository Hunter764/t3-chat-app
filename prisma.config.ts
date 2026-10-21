// Prisma CLI does not load env files on its own when a config file is present.
// Load .env.local first (what Next.js uses), then .env.
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
