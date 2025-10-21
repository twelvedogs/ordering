import { NextResponse } from "next/server";
import { getDatabase } from "../../lib/db";

export async function GET() {
  const db = getDatabase();

  try {
    // Create the modems table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS modems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        model TEXT
      )
    `);

    // Query all modems
    const modems = db.prepare("SELECT * FROM modems").all();

    return NextResponse.json({ success: true, data: modems });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch modems" },
      { status: 500 },
    );
  } finally {
    db.close();
  }
}
