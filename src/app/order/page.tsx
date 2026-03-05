import * as db from "../lib/db";

export default async function orderList() {
  try {
    const orders = await db.getAll("orders");
    return (
      <div>
        <div>Current Orders</div>
        <div>
          <a href="/order/edit">new</a>
        </div>
        <div>
          {orders.map((ord) => (
            <div key={ord._id.toString()}>
              <hr />
              should probably open a popup -{" "}
              <a href={`/order/edit?_id=${ord._id}`}>Edit</a>
              {Object.entries(ord).map(([key, value]) => (
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
    return <div>Error fetching orders</div>;
  } finally {
    // dunno how it's calling this before the previous await finishes
    // await db.end();
    // db.close();
  }
}
