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

// Create the modems table if it doesn't exist
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modems (
      id SERIAL PRIMARY KEY,
      name TEXT,
      model TEXT
    )
  `);
}

// Sample modem data
const modems = [
  { name: "ASUS RT-AX88U", model: "ASUS RT-AX88U" },
  { name: "ASUS RT-AX86U", model: "ASUS RT-AX86U" },
  { name: "NETGEAR Nighthawk AX12", model: "NETGEAR Nighthawk AX12" },
  { name: "NETGEAR Nighthawk RAX50", model: "NETGEAR Nighthawk RAX50" },
  { name: "TP-Link Archer AX90", model: "TP-Link Archer AX90" },
  { name: "Linksys MR9600", model: "Linksys MR9600" },
];

async function seedModems() {
  const client = await pool.connect();

  try {
    await createTable();

    // Begin transaction
    await client.query("BEGIN");

    // Insert modems
    for (const modem of modems) {
      await client.query("INSERT INTO modems (name, model) VALUES ($1, $2)", [
        modem.name,
        modem.model,
      ]);
    }

    // Commit transaction
    await client.query("COMMIT");

    console.log(
      `✅ Successfully inserted ${modems.length} modems into the database`,
    );

    // Verify the data
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM modems",
    );
    console.log(`📊 Total modems in database: ${countResult.rows[0].count}`);

    // Show all modems
    const allModemsResult = await pool.query(
      "SELECT * FROM modems ORDER BY id",
    );
    console.log("\n📋 Modems in database:");
    allModemsResult.rows.forEach((modem) => {
      console.log(
        `   - ID: ${modem.id}, Name: ${modem.name}, Model: ${modem.model}`,
      );
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding database:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedModems();
