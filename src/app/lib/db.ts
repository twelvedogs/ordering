import * as jsonschema from "jsonschema";
import { v4 as uuidv4 } from "uuid";
import getSchema from "../schemas/schemas";
import {Pool, Client} from "pg";


export async function save(data: any, collection: string) {
  try {
    // Validate data against schema
    collection = collection.toLowerCase();
    const schema = await getSchema(collection);
    const validation = jsonschema.validate(data, schema);
    if (validation.errors?.length > 0) {
      // throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      return { errors: validation.errors };
      // console.log(`validation errors with ${collection}`, validation.errors, data);
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
    console.error(`Error saving ${collection}:`, error);
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
