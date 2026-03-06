import * as db from "../lib/models/order";

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
          {orders.map((order) => (
            <div key={order._id.toString()}>
              <hr />
              not sure how to switch to edit func, probably just replace list -{" "}
              <a href={`/order/edit?_id=${order._id}`}>Edit</a>
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
    return <div>Error fetching orders</div>;
  }
}
