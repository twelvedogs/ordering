import Ajv from "ajv";
import addFormats from "ajv-formats"
import { v4 as uuidv4 } from "uuid";
import getSchema from "../schemas/schemas";
import { Client } from "pg";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { StrictMode } from "react";


export async function save(data: any, collection: string) {
    try {
        // Validate data against schema
        // todo: check collection name is valid
        // get raw schema as definded in <collection>.ts
        collection = collection.toLowerCase();
        var schema = await getSchema(collection);
        await schema.load();

        // todo: this is messy and probably insecure
        // we're validating data against the data itself, to some extent that's maybe necessary as the correct
        // values are provided by the client ie: selectable addresses
        // pull schema data in from the data blob so $ref: "#/data/addresses" gets replaced with actual address data
        let updatedSchema = await $RefParser.dereference({ schema: schema.schema, data }, { mutateInputSchema: false }) as any;
        schema.schema = updatedSchema.schema;

        let ajv = new Ajv({strictSchema: "log"});
        addFormats(ajv);
        ajv.addVocabulary(["inputType", "mapFields"])
        // jsonforms uses ajv for validation, might switch to https://github.com/jquense/yup?tab=readme-ov-file#yup
        const valid = ajv.validate(schema.schema, data);
        if (!valid) {
            console.log(`validation errors with ${collection}`, ajv.errors, data);
            return { errors: ajv.errors };
        }

        const client = new Client();
        await client.connect();

        // Ensure id is a UUID string
        let docId = data.id;
        if (!docId) {
            docId = uuidv4();
            data.id = docId;
        } else if (typeof docId === 'string') {
            data.id = docId;
        }

        const query = `
            INSERT INTO documents (id, collection, data, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (id, collection) 
            DO UPDATE SET data = $3, updated_at = NOW()
            RETURNING *;
            `;

        const result = await client.query(query, [docId, collection, JSON.stringify(data)]);
        // console.log(`Save ${collection} result`, result.rows[0]);
        await client.end();
        return { result: result.rows[0] };
    } catch (error) {
        console.error(`Error saving ${collection}:`, error, JSON.stringify(schema, null, 2));
        throw error;
    }
}

export async function get(id: string | null = null, collection: string) {
    try {
        const client = new Client();
        await client.connect();

        console.log(`get with id: ${id} and collection: ${collection}`)
        collection = collection.toLowerCase();
        let result = null;
        if (id) {
            const query = `
        SELECT id, data FROM documents 
        WHERE id = $1 AND collection = $2
      `;
            const queryResult = await client.query(query, [id, collection]);
            console.log('queryResult: ', result);
            result = queryResult.rows[0]?.data || null;
        } else {
            const query = `
        SELECT id, data FROM documents 
        WHERE collection = $1
      `;
            const queryResult = await client.query(query, [collection]);
            result = queryResult.rows.map(row => ({ id: row.id, ...row.data }));

        }
        await client.end();
        return result;
    } catch (error) {
        console.error(`Error getting ${collection}:`, error);
        throw error;
    }
}

export async function del(id: string, collection: string) {
    try {
        const client = new Client();
        await client.connect();
        collection = collection.toLowerCase();
        if (!id) {
            throw new Error('Missing id for deletion');
        }

        const query = `
      DELETE FROM documents 
      WHERE id = $1 AND collection = $2
      RETURNING *;
    `;

        const result = await client.query(query, [id, collection]);

        console.log('delete result', result.rowCount);
        await client.end();
        return { acknowledged: true, deletedCount: result.rowCount };
    } catch (error) {
        console.error(`Error deleting from ${collection}:`, error);
        throw error;
    }
}
