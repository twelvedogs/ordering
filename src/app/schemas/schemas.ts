import * as db from "../lib/db";
import * as customer from "./customer";
import * as modem from "./modem";
import * as order from "./order";

let schemas = {};
schemas['customers'] = customer.createSchema();
schemas['modems'] = modem.createSchema();
schemas['orders'] = order.createSchema();

export default async function getSchema(collection: string){
    console.log(schemas);
    return await schemas[collection];
}

