const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "ordering.db");
const db = new Database(dbPath);

// Create the modems table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS modems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    model TEXT
  )
`);

// Sample modem data
const modems = [
  { name: "ASUS RT-AX88U", model: "ASUS RT-AX88U" },
  { name: "ASUS RT-AX86U", model: "ASUS RT-AX86U" },
  { name: "NETGEAR Nighthawk AX12", model: "NETGEAR Nighthawk AX12" },
  { name: "NETGEAR Nighthawk RAX50", model: "NETGEAR Nighthawk RAX50" },
  { name: "TP-Link Archer AX90", model: "TP-Link Archer AX90" },
  { name: "Linksys MR9600", model: "Linksys MR9600" },
];

// Insert modems
const insert = db.prepare("INSERT INTO modems (name, model) VALUES (?, ?)");

const insertMany = db.transaction((modems) => {
  for (const modem of modems) {
    insert.run(modem.name, modem.model);
  }
});

try {
  insertMany(modems);
  console.log(`✅ Successfully inserted ${modems.length} modems into the database`);

  // Verify the data
  const count = db.prepare("SELECT COUNT(*) as count FROM modems").get();
  console.log(`📊 Total modems in database: ${count.count}`);

  // Show all modems
  const allModems = db.prepare("SELECT * FROM modems").all();
  console.log("\n📋 Modems in database:");
  allModems.forEach(modem => {
    console.log(`   - ID: ${modem.id}, Name: ${modem.name}, Model: ${modem.model}`);
  });
} catch (error) {
  console.error("❌ Error seeding database:", error.message);
} finally {
  db.close();
}
