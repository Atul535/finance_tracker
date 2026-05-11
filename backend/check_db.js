const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema='finance_tracker' AND table_name='User';
    `);
    console.log("finance_tracker.User columns:", res.rows.map(r => r.column_name));

    const res2 = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='User';
    `);
    console.log("public.User columns:", res2.rows.map(r => r.column_name));

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
