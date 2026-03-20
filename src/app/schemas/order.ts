import * as db from "../lib/db";
import {ModemData} from "./modem";


// todo: do i need an orderId as well as just the rowId?
export class Order {
    schema = {
            type: "object",
            properties: {
                // orderId: { type: "number" },
                crmId: { type: "string" }, //guid
                firstName: { type: "string", minLength: 2 },
                lastName: { type: "string", minLength: 2 },
                age: { type: "number" },
                modemType: { type: "string", enum: ['None Available'] },
                serviceType: { type: "string", enum: [
                    "FTTN Fibre to the Node",
                    "FTTB Fibre To The Basement",
                    "FTTP Fibre to the Premises",
                    "FTTC Fibre to the Curb",
                ] },
                plan: { type: "string", enum: ["Basic", "Premium", "Enterprise"] },
                quota: { type: "string", readOnly: true },
                speed: { type: "string", readOnly: true },
                contract: { type: "string", readOnly: true },
                customerReference: { type: "string" },
                newConnection: { type: "string", enum: ["New", "Existing"] },
            },
            required: ["firstName", "lastName"],
        };

    load = async ()=>{
        const modems = await db.get(null, 'modems') as ModemData[];
        const modemSet = new Set(modems.map(modem => modem.name).filter((modemName) => modemName !== undefined));
        this.schema.properties.modemType.enum = [...modemSet];

        // todo: plans, connection, serviceType
        
        console.log('updated schema: ', this.schema);
    }
}
