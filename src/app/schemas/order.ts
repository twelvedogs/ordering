import * as db from "../lib/db";
import { ModemData } from "./modem";


// todo: do i need an orderId as well as just the rowId?
// todo: do i need to move the inputType stuff to a separate object so it doesn't pollute the db?  maybe not, this is just a schema and only the form values are stored
export class Order {
    schema = {
        type: "object",
        properties: {
            // orderId: { type: "number" },
            crmId: { type: "string", inputType: "text" }, //guid
            firstName: { type: "string", minLength: 2, inputType: "text" },
            lastName: { type: "string", minLength: 2, inputType: "text" },
            age: { type: "number", inputType: "number" },
            modemType: { type: "string", enum: ['None Available'], inputType: "select" },
            serviceType: {
                type: "string", enum: [
                    "FTTN Fibre to the Node",
                    "FTTB Fibre To The Basement",
                    "FTTP Fibre to the Premises",
                    "FTTC Fibre to the Curb",
                    "Wireless",
                    "Opticomm",
                ], inputType: "select"
            },
            plan: { type: "string", enum: ["Basic", "Premium", "Enterprise"], inputType: "select" },
            quota: { type: "string", readOnly: true, inputType: "text" },
            speed: { type: "string", readOnly: true, inputType: "text" },
            contract: { type: "string", readOnly: true, inputType: "text" },
            customerReference: { type: "string", inputType: "text" },
            newConnection: { type: "string", enum: ["New", "Existing"], inputType: "select" },
        },
        // fields: {
        //     crmId: { type: "string", inputType: "text" }, //guid
        //     firstName: { type: "string", minLength: 2 , inputType: "text"},
        //     lastName: { type: "string", minLength: 2 , inputType: "text"},
        //     age: { type: "number" , inputType: "number"},
        //     modemType: { type: "string", enum: ['None Available'], inputType: "select"},
        //     serviceType: { type: "string", enum: [
        //         "FTTN Fibre to the Node",
        //         "FTTB Fibre To The Basement",
        //         "FTTP Fibre to the Premises",
        //         "FTTC Fibre to the Curb",
        //     ] , inputType: "select"},
        //     plan: { type: "string", enum: ["Basic", "Premium", "Enterprise"] , inputType: "select"},
        //     quota: { type: "string", readOnly: true , inputType: "text"},
        //     speed: { type: "string", readOnly: true , inputType: "text"},
        //     contract: { type: "string", readOnly: true ,inputType: "text"},
        //     customerReference: { type: "string" ,inputType: "text"},
        //     newConnection: { type: "string", enum: ["New", "Existing"], inputType: "select"},
        // },
        required: ["firstName", "lastName"],
    };

    load = async () => {
        const modems = await db.get(null, 'modems') as ModemData[];
        const modemSet = new Set(modems.map(modem => modem.name).filter((modemName) => modemName !== undefined));
        this.schema.properties.modemType.enum = [...modemSet];

        // todo: plans, connection, serviceType

        console.log('updated schema: ', this.schema);
    }
}
