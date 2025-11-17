import React from "react";
import { getDatabase } from "@/app/lib/db";

import OrderFormClient from "@/app/order/edit/OrderFormClient";
// Server Component - fetches data
export default async function OrderPage({ searchParams }) {
  var sp = await searchParams;
  console.log("searchParams", sp);
  const db = getDatabase();

  try {
    const orderId = sp.id;
    const orderQuery = await db.query("SELECT * FROM users WHERE crmid = $1", [
      orderId,
    ]);
    const order = orderQuery.rows[0];
    console.log("order", order);
    const modems = await db.query("SELECT * FROM modems");
    const modemOptions = modems.rows.map((modemRow) => modemRow.model);
    return (
      <div>
        <OrderFormClient order={order} modemOptions={modemOptions} />
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
