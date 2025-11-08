import React from "react";
import { getDatabase } from "@/app/lib/db";

import OrderFormClient from "@/app/order/OrderFormClient";
// Server Component - fetches data
export default async function OrderPage() {
  const db = getDatabase();

  try {
    // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
    // const values = ['brianc', 'brian.m.carlson@gmail.com']

    // const res = await db.query(text, values)
    // console.log(res.rows[0])

    const modems = await db.query("SELECT * FROM modems");

    var modemOptions = modems.rows.map((modemRow) => modemRow.model);

    // Fetch all modems
    // const modems = db.query("SELECT * FROM modems").all() as Array<{
    //   id: number;
    //   name: string;
    //   model: string;
    // }>;

    // Extract model names for the form enum
    // const modemOptions =
    //   modems.length > 0
    //     ? modems.map((modem) => modem.model)
    //     : ["ASUS", "NETGEAR"]; // Fallback to defaults if no data

    return <OrderFormClient modemOptions={modemOptions} />;
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
