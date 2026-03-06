import { ObjectId } from "mongodb";
import OrderFormClient from "./OrderFormClient";
import * as db from "../../lib/db";
import { createSchema } from "../../schemas/order";

// these @ things might break if a client tries to import a server component? ffik
// import { get } from "@/app/schemas/order";

// Server Component - fetches data
export default async function OrderPage({ searchParams = null }) {
  var sp = await searchParams;

  // console.log("searchParams", sp);

  try {

    const orderId = sp._id;

    const order = await db.get(new ObjectId(sp._id), "orders"); //.then((resp)=>{console.log(resp);});
    // feels bad man, deep copy the object
    const orderJson = JSON.parse(JSON.stringify(order));
    console.log('orderJson', orderJson);

    // i'm doing this the dumb way, should be able to pull the whole structure
    // out of mongodb? might have to build it from dynamic parts of the schema?
    const schema = await createSchema();

    console.log(schema);

    // insert the client side code
    return (
      <div>
        <OrderFormClient order={orderJson} schema={schema} />
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <OrderFormClient />;
  }
}
