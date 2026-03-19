import * as db from "../lib/db";

export class Modem {
    schema = {
        type: "object",
        properties: {
            modemId: { type: "number" },
            name: { type: "string", minLength: 2 },
            price: { type: "string", minLength: 2 },
            brand: { type: "number" },
            active: { type: "string" },
        },
        required: ["name", "price"],
    };

    load = async ()=>{
        
    }
}

export interface ModemData {
    modemId: number;
    name: string;
    price: string;
    brand: number;
    active: string;
}