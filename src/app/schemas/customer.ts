export class Customer {
    schema = {
        type: "object",
        properties: {
            crmid: { type: "number" },
            firstName: { type: "string", minLength: 2 },
            lastName: { type: "string", minLength: 2 },
            contract: { type: "string", description: "this needs to go lol" },
            licence: { type: "string", readOnly: true },
            dob: { type: "string", format: "date" },
            created: { type: "string", format: "date" },
        },
        required: ["firstName", "lastName"],
    };

    load = async () => {

    }
}