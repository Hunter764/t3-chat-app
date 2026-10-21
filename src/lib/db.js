import { PrismaClient } from "@prisma/client";

// Reuse one client across hot reloads in development.
const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export default db;
