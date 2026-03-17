import { NextResponse } from "next/server";
import * as db from "../../lib/db";

export async function TEST(request: Request) {}

export async function GET(request: Request) {
  const data = await request.json();
  return db.get(data.id, data.collection);
}

export async function PUT(request: Request) {
  console.log('Write PUT code i guess');
}

export async function DELETE(request: Request) {
    const req = await request.json();
    let result = await db.del(req.data.id, req.form);  
    return NextResponse.json(result);
}

export async function POST(request: Request) {
  // get form data  
  const req = await request.json();
  console.log('post', req);

  // todo: authorisation, 
  //   schema validation is in save

  try {
    const result = await db.save(req.data, req.form);
    if (result.errors?.length > 0) {
      // todo: not a 400 error
      return NextResponse.json(
        { error: "Form failed validation.", ok: false, errors: result.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save order data." },
      { status: 500 },
    );
  }
}
