// not sure if this is the right object structure
export const Address = {
    type: "object",
    properties: {
        name: { type: "string" },
        line1: { type: "string" },
        line2: { type: "string" },
        postcode: { type: "number", minLength: "4" },
        state: { type: "string" }

    }, required: ["line1", "postcode", "state"]
}