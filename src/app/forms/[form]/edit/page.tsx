import { ObjectId } from "mongodb";
import * as db from "../../../lib/db";
import getSchema from "../../../schemas/schemas";
import Client from "./client";

// server side of the edit page
export default async function Page({ params, searchParams }: { params: { form: string }, searchParams: { _id?: string } })  {
  const p = {...await params, ...await searchParams};
  try {
    const doc = await db.get(new ObjectId(p._id), p.form);
    // feels bad man, deep copy the object or else nextjs barfs when you pass it
    // to the client because of too complex properties
    const doc_copy = JSON.parse(JSON.stringify(doc));

    // i'm doing this the dumb way, should be able to pull the whole structure
    // out of mongodb? might have to build it from dynamic parts of the schema?
    const schema = await getSchema(p.form);

    // insert the client side code
    return (
      <div>
        <Client document={doc_copy} schema={schema} form={p.form} />
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <Client form={p.form} />;
  }
}
