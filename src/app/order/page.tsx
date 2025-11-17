import React from "react";
import { getDatabase } from "@/app/lib/db";

// Server Component - fetches data
export default async function OrderList() {
  const db = getDatabase();

  try {
    // todo: change to orders
    const orders = await db.query("SELECT * FROM users");
    return (
      <div>
        <div>
          <a href="/order/edit">new</a>
        </div>
        <div>
          {orders.rows.map((order) => (
            <div key={order.id}>
              should probably open a popup
              <a href={`/order/edit?id=${order.id}`}>Edit</a>
              {Object.entries(order).map(([key, value]) => (
                <p key={key}>
                  {key}: {String(value)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <div>Error fetching orders</div>;
  } finally {
    // dunno how it's calling this before the previous await finishes
    // await db.end();
    // db.close();
  }
}
