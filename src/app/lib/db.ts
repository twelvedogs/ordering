import { MongoClient, ObjectId } from "mongodb";

// todo: validate collection name

export async function get(_id: ObjectId, collection: string) {
  const uri = "mongodb://localhost:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");

  const result = await db.collection(collection).findOne({ _id: _id });
  console.log(result);
  await client.close();
  return result;
}

export async function getAll(collection: string) {
  const uri = "mongodb://127.0.0.1:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");
  const result = await db.collection(collection).find().toArray();
  console.log(result);
  await client.close(); // dunno if we should be constantly open/closing this
  return result;
}

export function getMongoDb() {
  const uri = "mongodb://127.0.0.1:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");
  return db;
}

async function test() {
  const db = getMongoDb();
  const result = await db
    .collection("orders")
    .findOne({ _id: new ObjectId("691abad49e885c675cf4cc4f") });
  console.log(result);
  await db.client.close();
}
export default getMongoDb;
