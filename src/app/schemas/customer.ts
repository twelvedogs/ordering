
import { Address } from "./address";

export class Customer {
    schema = {
        type: "object",
        properties: {
            crmid: { type: "number", inputType: "text" },
            firstName: { type: "string", minLength: 1, inputType: "text" },
            lastName: { type: "string", minLength: 1, inputType: "text" },
            licenceNumber: { type: "string", readOnly: true, inputType: "text" },
            dob: { type: "string", format: "date", inputType: "date" },
            created: { type: "string", format: "date", inputType: "date" },
            passedCreditCheck: { type: "boolean", inputType: "checkbox" },

            // todo: not sure what to do with this, the address list is like a list of info about the customer
            //      but it's not a value in itself.  probably hide the field at least
            addresses: { type: "array", items: Address, inputType:"none"},
            // this is silly by the way i'm solving a dumb problem, addresses does *not*
            // need to be an array, however modems etc on order does
            physicalAddress: {
                type: "object", // should be an int, the way i've automated the state updates makes it a string though
                inputType: "select",
                anyOf: { $ref: "#/data/addresses" },
                mapFields: { 
                    const: "id",
                    title: "line1"
                },
                // might work.  a different way though, don't put it in the schema
                //mapFunc: () => {this.schema.properties.physicalAddress.map((item)=>{return {const: item.line1} })}
            },
            postalAddress: {
                type: "object",
                inputType: "select",
                anyOf: { $ref: "#/data/addresses" },
                mapFields: { 
                    const: "id",
                    title: "line1"
                }
            },
            billingAddress: {
                type: "object",
                inputType: "select",
                anyOf: { $ref: "#/data/addresses" },
                mapFields: { 
                    const: "id",
                    title: "line1"
                }
            },
        },
        required: ["firstName", "lastName"],
    };

    load = async () => {
        console.log('loading customer');
    }
}