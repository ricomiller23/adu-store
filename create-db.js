const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_KdGuj6z9XIvJ@ep-bold-art-am03gmhb-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function createDatabase() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to Neon. Attempting to create database...");
    await client.query('CREATE DATABASE boe_hass_lead_generator;');
    console.log("Database boe_hass_lead_generator created successfully!");
  } catch (err) {
    if (err.code === '42P04') {
      console.log("Database boe_hass_lead_generator already exists.");
    } else {
      console.error("Error creating database:", err);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
