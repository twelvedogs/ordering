import * as db from "@/app/lib/db";
import getSchema from "@/app/schemas/schemas";
import Client from "./client";
import $RefParser from "@apidevtools/json-schema-ref-parser";

// server side of the edit page
export default async function Page({ params, searchParams }: { params: { form: string }, searchParams: { id?: string } }) {
    const p = { ...await params, ...await searchParams };
    let form: string;
    try {

        let doc = {};
        form = p.form.toLowerCase();
        // get returns all of them with null id
        if (p.id)
            doc = await db.get(p.id, form);
        // feels bad man, deep copy the object or else nextjs barfs when you pass it
        // to the client because of too complex properties
        const doc_copy = JSON.parse(JSON.stringify(doc));

        const schema = (await getSchema(form));
        if (schema.load)
            await schema.load();
        await $RefParser.dereference({ schema, data: doc_copy });

        // insert the client side code
        return (
            <div>
                <Client document={doc_copy} schema={schema.schema} uischema={schema.uischema ? schema.uischema : {}} form={form} />
            </div>
        );
    } catch (error) {
        console.error("Database error:", error);
        // Fallback to default options on error
        return <Client form={form} />;
    }
}
