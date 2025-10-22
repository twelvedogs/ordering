import React from "react";
import { getDatabase } from "@/app/lib/db";
import OrderFormClient from "./OrderFormClient";

// Server Component - fetches data
export default async function OrderPage() {
  const db = getDatabase();

  try {
    // Ensure modems table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS modems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        model TEXT
      )
    `);

    // Fetch all modems
    const modems = db.prepare("SELECT * FROM modems").all() as Array<{
      id: number;
      name: string;
      model: string;
    }>;

    // Extract model names for the form enum
    const modemOptions =
      modems.length > 0
        ? modems.map((modem) => modem.model)
        : ["ASUS", "NETGEAR"]; // Fallback to defaults if no data

    return <OrderFormClient modemOptions={modemOptions} />;
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <OrderFormClient modemOptions={["ASUS", "NETGEAR"]} />;
  } finally {
    db.close();
  }
}
