import * as jsonschema from "jsonschema";
import * as order from "../../schemas/order";
import { MongoClient, ObjectId } from "mongodb";
import { ConnectionPool } from "../ConnectionPool";

// Initialize pool when module loads
const pool = ConnectionPool.getInstance();

// Initialize the connection pool when the module is loaded
(async () => {
  try {
    await pool.initialize();
  } catch (error) {
    console.error('Failed to initialize MongoDB connection pool:', error);
  }
})();

export async function del(_id: ObjectId, collection: string) {
    const uri = "mongodb://127.0.0.1:27017/crud";
    const client = new MongoClient(uri);
    const db = client.db("ordering");

    const result = await db.collection(collection).deleteOne({ _id: _id });
    console.log('delete result', result);
    await client.close();
    return result;
}

export async function get(_id: ObjectId, collection: string) {
  const uri = "mongodb://127.0.0.1:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");

  const result = await db.collection(collection).findOne({ _id: _id });
  console.log('get result', result);
  await client.close();
  return result;
}

export async function getAll(collection: string) {
  const uri = "mongodb://127.0.0.1:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");
  const result = await db.collection(collection).find().toArray();
  console.log('getAll',result);
  await client.close(); // dunno if we should be constantly open/closing this
  return result;
}

export async function save(data){

    const uri = "mongodb://127.0.0.1:27017/crud";
    const client = new MongoClient(uri);
    const db = client.db("ordering");

    jsonschema.validate(data, order.createSchema());

    data._id = new ObjectId(data._id);

    let result = await db
        .collection("orders")
        .updateOne({ _id: data._id }, { $set: data }, { upsert: true});
        
    console.log('save order result', result);

    return result;
}