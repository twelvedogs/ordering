import * as db from "../lib/db";

export class Modem {
    schema = {
        type: "object",
        properties: {
            modemId: { type: "number", inputType: "none"},
            name: { type: "string", inputType: "text", minLength: 2 },
            price: { type: "string", inputType: "text", minLength: 2 },
            brand: { type: "number", inputType: "select" },
            active: { type: "string", inputType: "checkbox" },
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