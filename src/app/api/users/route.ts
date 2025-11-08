import { getDatabase } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const db = getDatabase();
  const data = await request.json();

  // Extract data from the request body, providing default values for any that are missing
  const {
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

  // Validate required fields
  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First name and last name are required." },
      { status: 400 }
    );
  }

  const query = `
    INSERT INTO users (
      crmid, firstName, lastName, age, modemType, serviceType, plan, quota,
      speed, contract, customerReference, newConnection
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
    RETURNING *;
  `;

  const values = [
    crmid,
    firstName,
    lastName,
    age,
    modemType,
    serviceType,
    plan,
    quota,
    speed,
    contract,
    customerReference,
    newConnection,
  ];

  try {
    const result = await db.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save user data." },
      { status: 500 }
    );
  }
}
