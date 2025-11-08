const { Pool } = require("pg");
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env.local"),
});

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "postgres",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "ordering",
});

async function initDatabase() {
  try {
    console.log("🔄 Initializing PostgreSQL database...");

    // Create the modems table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS modems (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        model TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Modems table created successfully");

    // Add any other tables here as needed
    // Example:
    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS orders (
    //     id SERIAL PRIMARY KEY,
    //     modem_id INTEGER REFERENCES modems(id),
    //     customer_name TEXT NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   )
    // `);

    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
