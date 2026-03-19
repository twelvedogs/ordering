import * as db from "../lib/db";

/**
 * Recursively traverses a schema object and replaces @@@ placeholders with database values.
 * For example: '@@@modems' is replaced with an array of modem names from the 'modems' table.
 */
async function resolveSchemaPlaceholders(obj: any): Promise<void> {
    // Iterate through all keys in the object
    for (const key in obj) {
        // Handle arrays (typically enum arrays)
        if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
                // Check if the value is a string starting with @@@
                if (typeof obj[key][i] === 'string' && obj[key][i].startsWith('@@@')) {
                    // Extract table name by removing the @@@ prefix
                    const tableName = obj[key][i].substring(3);
                    // Query the database for all records in that table
                    const results = await db.get(null, tableName);
                    // Map results to extract just the 'name' field, filtering out undefined values
                    const names = results
                        .map((item: any) => item.name)
                        .filter((name: any) => name !== undefined);
                    // Replace the placeholder with the array of actual names
                    obj[key][i] = names;
                }
            }
        } 
        // Recursively handle nested objects
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            await resolveSchemaPlaceholders(obj[key]);
        }
    }
}

export class Generic {
    schema = {
            type: "object",
            properties: {
                orderId: { type: "number" },
                crmid: { type: "number" },
                firstName: { type: "string", minLength: 2 },
                lastName: { type: "string", minLength: 2 },
                age: { type: "number" },
                modemType: { type: "string", enum: ['@@@modems'] },
                serviceType: { type: "string", enum: ['@@@serviceTypes'] },
                plan: { type: "string", enum: ['@@@plans'] },
                quota: { type: "string", readOnly: true },
                speed: { type: "string", readOnly: true },
                contract: { type: "string", readOnly: true },
                customerReference: { type: "string" },
                newConnection: { type: "string", enum: ["New", "Existing"] },
            },
            required: ["firstName", "lastName"],
        };

    load = async (schemaName) => {
        const schema = await db.get(schemaName, 'schema');
        this.schema = schema.schema;
        
        await resolveSchemaPlaceholders(this.schema);
        
        console.log('updated schema: ', this.schema);
    }
}