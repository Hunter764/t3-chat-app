import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const db = globalThis.prisma || new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn', 'info'],
});

if (process.env.NODE_ENV === "development") {
    global.prisma = db;
}

export default db;
