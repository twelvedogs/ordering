import React from "react";
import { getDatabase } from "@/app/lib/db";

import OrderFormClient from "@/app/order/edit/OrderFormClient";
// Server Component - fetches data
export default async function OrderPage() {
  const db = getDatabase();

  try {
    const modems = await db.query("SELECT * FROM modems");
    const modemOptions = modems.rows.map((modemRow) => modemRow.model);
    return (
      <div>
        <OrderFormClient modemOptions={modemOptions} />
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <OrderFormClient modemOptions={["ASUS", "NETGEAR"]} />;
  } finally {
    // dunno how it's calling this before the previous await finishes
    // await db.end();
    // db.close();
  }
}
