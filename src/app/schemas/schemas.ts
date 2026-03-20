import {Customer} from "./customer";
import {Modem} from "./modem";
import {Order} from "./order";

let schemas = {};
schemas['customers'] = Customer;
schemas['modems'] = Modem;
schemas['orders'] = Order;

export default async function getSchema(collection: string){
    return await new schemas[collection]();
}



