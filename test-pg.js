import pg from 'pg';
const { Pool } = pg;

async function main() {
  console.log('Testing raw pg pool...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/t3chatbuild' });
  try {
    const res = await pool.query('SELECT 1 as result');
    console.log('Got result:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
main();
