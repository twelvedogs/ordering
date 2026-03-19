import * as customer from "./customer";
import * as modem from "./modem";
import * as order from "./order";

let schemas = {};
schemas['customers'] = customer;
schemas['modems'] = modem;
schemas['orders'] = order;

export default async function getSchema(collection: string){
    return await schemas[collection];
}



