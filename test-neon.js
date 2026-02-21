const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("Successfully connected to Neon!");
    const res = await client.query('SELECT NOW()');
    console.log("Current time from DB:", res.rows[0].now);
  } catch (err) {
    console.error("Connection error", err.stack);
  } finally {
    await client.end();
  }
}

testConnection();
