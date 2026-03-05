import { MongoClient, ObjectId } from "mongodb";
import OrderFormClient from "./OrderFormClient";
// import OrderFormClient from "@/app/order/edit/OrderFormClient";
import { get } from "../../lib/db";
// these @ things might break if a client tries to import a server component? ffik
// import { get } from "@/app/schemas/order";

// Server Component - fetches data
export default async function OrderPage({ searchParams = null }) {
  var sp = await searchParams;
  // var sp = { _id: 1 };
  console.log("searchParams", sp);

  try {
    // todo: if no object id create new order
    const orderId = sp._id;
    // wonder if local can talk to mongo
    // const uri = "mongodb://localhost:27017/crud";
    // const client = new MongoClient(uri);
    // const db = client.db("ordering");

    // const order = await db
    //   .collection("orders")
    //   .findOne({ _id: new ObjectId(orderId) });

    const order = get(new ObjectId(sp._id), "orders");
    console.log(order);
    // feels bad man, deep copy the object
    const orderJson = JSON.parse(JSON.stringify(order));

    // const modems = await db.collection("modems").find().toArray();
    // let modemOptions = modems.map((modem) => modem.name);
    // if (!modemOptions || modemOptions.length === 0) {
    //  modemOptions = ["ASUS", "NETGEAR"];
    //}
    let modemOptions = ["ASUS", "NETGEAR"];
    // i'm doing this the dumb way, should be able to pull the whole structure
    // out of mongodb? might have to build it from dynamic parts of the schema?
    // console.log(modems, modemOptions);

    // insert the client side code
    return (
      <div>
        <OrderFormClient order={orderJson} modemOptions={modemOptions} />
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
