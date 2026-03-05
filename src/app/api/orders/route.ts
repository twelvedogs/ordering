import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { get } from "../../lib/db";

export async function TEST(request: Request) {}

export async function GET(request: Request) {
  const data = await request.json();
  return get(new ObjectId(data._id), "orders");
}

export async function PUT(request: Request) {
  const data = await request.json();
  console.log(data);

  const uri = "mongodb://localhost:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");

  const result = await db
    .collection("orders")
    .updateOne({ _id: new ObjectId(data.id) }, { $set: data });
  console.log(result);

  await client.close();
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const data = await request.json();
  console.log(data);

  const uri = "mongodb://localhost:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");

  const result = await db
    .collection("orders")
    .deleteOne({ _id: new ObjectId(data.id) });
  console.log(result);

  await client.close();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  // todo: move
  const uri = "mongodb://localhost:27017/crud";
  const client = new MongoClient(uri);
  const db = client.db("ordering");

  // get form data
  const data = await request.json();
  console.log("form data:", data);
  data._id = new ObjectId(data._id);

  // Extract data from the request body, providing default values for any that are missing
  // stuff the object properties into variables
  const {
    orderId,
    crmid = null,
    firstName,
    lastName,
    age = null,
    modemType = null,
    serviceType = null,
    plan = null,
    quota = null,
    speed = null,
    contract = null,
    customerReference = null,
    newConnection = null,
  } = data;

  // todo: this should validate against the schema
  // Validate required fields
  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First name and last name are required." },
      { status: 400 },
    );
  }

  try {
    const result = await db
      .collection("orders")
      .updateOne({ _id: data._id }, { $set: data });
    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save order data." },
      { status: 500 },
    );
  }
}
