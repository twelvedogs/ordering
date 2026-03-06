import * as jsonschema from "jsonschema";
import * as order from "../../schemas/order";
import { ObjectId } from "mongodb";
import { ConnectionPool } from "../ConnectionPool";

// Initialize pool when module loads
const pool = ConnectionPool.getInstance();

// Initialize the connection pool when the module is loaded
(async () => {
  try {
    await pool.initialize();
  } catch (error) {
    console.error('Failed to initialize MongoDB connection pool:', error);
  }
})();

export async function save(data: any, collection: string) {
  try {
    // Validate data against schema
    const schema = await order.createSchema();
    const validation = jsonschema.validate(data, schema);
    if (validation.errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }

    const db = pool.getDatabase();

    // Ensure _id is properly converted to ObjectId
    let documentId = data._id;
    if (typeof data._id === 'string') {
      try {
        documentId = new ObjectId(data._id);
      } catch (error) {
        throw new Error('Invalid ObjectId format');
      }
    }

    // Update or insert the document
    const result = await db
      .collection(collection)
      .updateOne(
        { _id: documentId },
        { $set: data },
        { upsert: true }
      );
    console.log(`Save ${collection} result`, result);
    return result;
  } catch (error) {
    console.error(`Error saving ${collection}:`, error);
    throw error;
  }
}

// probably shouldn't have 2 different return types
export async function get(_id: ObjectId | string | null = null, collection: string) {
  try {
    const db = pool.getDatabase();
    let result = null;
    if (_id) {
      // Convert string _id to ObjectId if needed
      let objectId: ObjectId;
      if (typeof _id === 'string') {
        objectId = new ObjectId(_id);
      } else {
        objectId = _id as ObjectId;
      }

      result = await db
        .collection(collection)
        .findOne({ _id: objectId });
    } else {
      const cursor = db.collection(collection).find({});
      result = await cursor.toArray();
    }

    return result;
  } catch (error) {
    console.error(`Error getting ${collection}:`, error);
    throw error;
  }
}

export async function del(_id: ObjectId, collection: string) {
    try {
      const db = pool.getDatabase();
    if (!_id) {
      throw new Error('Missing _id for deletion');
    }

    let objectId: ObjectId;
    if (typeof _id === 'string') {
      if (!ObjectId.isValid(_id)) {
        throw new Error('Invalid ObjectId format');
      }
      objectId = new ObjectId(_id);
    } else if (_id instanceof ObjectId) {
      objectId = _id;
    } else {
      throw new Error('Invalid _id type');
    }

    const result = await db.collection(collection).deleteOne({ _id: objectId });

    return result;
  } catch (error) {
    console.error(`Error getting ${collection}:`, error);
    throw error;
  }
}
