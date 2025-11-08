import { NextResponse } from "next/server";
import { getDatabase } from "../../lib/db";

export async function GET() {
  const pool = getDatabase();

  try {
    // Create the modems table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS modems (
        id SERIAL PRIMARY KEY,
        name TEXT,
        model TEXT
      )
    `);

    // Query all modems
    const result = await pool.query("SELECT * FROM modems ORDER BY id");

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch modems" },
      { status: 500 },
    );
  }
}
