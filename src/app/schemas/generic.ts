import * as db from "@/app/lib/db";



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


        console.log('updated schema: ', this.schema);
    }
}