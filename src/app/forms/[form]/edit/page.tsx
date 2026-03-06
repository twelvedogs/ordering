import { ObjectId } from "mongodb";
import * as db from "../../../lib/db";
import getSchema from "../../../schemas/schemas";
import Client from "./client";

// server side of the edit page
export default async function Page({ params }: { params: { form: string, _id: string | null } })  {
  const sp = await params;
  try {
    const doc = await db.get(new ObjectId(sp._id), sp.form);
    // feels bad man, deep copy the object or else nextjs barfs when you pass it
    // to the client
    const doc_copy = JSON.parse(JSON.stringify(doc));

    // i'm doing this the dumb way, should be able to pull the whole structure
    // out of mongodb? might have to build it from dynamic parts of the schema?
    const schema = await getSchema(sp.form);

    console.log(schema);

    // insert the client side code
    return (
      <div>
        <Client document={doc_copy} schema={schema} form={sp.form} />
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    // Fallback to default options on error
    return <Client form={sp.form} />;
  }
}
