const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_KdGuj6z9XIvJ@ep-bold-art-am03gmhb-pooler.c-5.us-east-1.aws.neon.tech/boe_hass_lead_generator?sslmode=require";

async function dropAllTables() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to boe_hass_lead_generator. Dropping all tables...");
    
    // Query to get all table names
    const res = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);
    
    const tables = res.rows.map(row => `"${row.tablename}"`);
    if (tables.length > 0) {
      const dropQuery = `DROP TABLE IF EXISTS ${tables.join(', ')} CASCADE;`;
      console.log("Executing:", dropQuery);
      await client.query(dropQuery);
      console.log("All tables dropped successfully.");
    } else {
      console.log("No tables found to drop.");
    }
  } catch (err) {
    console.error("Error dropping tables:", err);
  } finally {
    await client.end();
  }
}

dropAllTables();
