export class ModemBrand {
    schema = {
        type: "object",
        properties: {
            name: { type: "string", inputType: "text"}
        },
        required: ["name"],
    };
}