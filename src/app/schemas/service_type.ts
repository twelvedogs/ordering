import * as db from "../lib/db";

export class ServiceType {
    schema = {
        type: "object",
        properties: {
            serviceTypeId: { type: "number" },
            name: { type: "string", minLength: 2 },
        },
        required: ["name", "modemId"],
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