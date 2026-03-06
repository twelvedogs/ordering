import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import * as db from "../../lib/db";

export async function TEST(request: Request) {}

export async function GET(request: Request) {
  const data = await request.json();
  return db.get(new ObjectId(data._id), data.collection);
}

export async function PUT(request: Request) {
  // const data = await request.json();
  // console.log('request.json', data);

  // const uri = "mongodb://127.0.0.1:27017/crud";
  // const client = new MongoClient(uri);
  // const db = client.db("ordering");

  // const result = await db
  //   .collection("orders")
  //   .updateOne({ _id: new ObjectId(data.id) }, { $set: data }, { upsert: true });
  // console.log(result);

  // await client.close();
  // return NextResponse.json(result);
}

export async function DELETE(request: Request) {
    const req = await request.json();
    let result = await db.del(req.data._id, req.form);  
    return NextResponse.json(result);
}

export async function POST(request: Request) {
  // get form data  
  const req = await request.json();
  console.log(req);

  // todo: authorisation, 
  //   schema validation is in save

  try {
    const result = await db.save(req.data, req.form);
    // if (result.errors !== '') {
    //   return NextResponse.json(
    //     { error: "First name and last name are required." },
    //     { status: 400 },
    //   );
    // }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save order data." },
      { status: 500 },
    );
  }
}
