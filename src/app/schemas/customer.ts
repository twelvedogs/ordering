
// not sure if this is the right object structure
const Address = {
    type: "object",
    properties: {
        name: { type: "string" },
        line1: { type: "string" },
        line2: { type: "string" },
        postcode: { type: "number", minLength: 4 },
        state: { type: "string" }

    }, required: ["line1", "postcode", "state"]
}

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
            test: {
                type: "string", 
                inputType: "select",
                oneOf: [
                    { const: "t1", title: "test 1" }, 
                    { const: "t2", title: "test 2" },
                    { const: "t3", title: "test 3" },
                    { const: "t4", title: "test 4" }
                ]
                
            },
            // todo: not sure what to do with this, the address list is like a list of info about the customer
            //      but it's not a value in itself.  probably hide the field at least
            addresses: { type: "array", items: Address },
            // use array index or should i add an id field to the address?
            // this is silly by the way i'm solving a dumb problem, addresses does *not*
            // need to be an array, however modems etc on order does
            physicalAddress: {
                type: "number",
                inputType: "select",
                oneOf: { $ref: "#/data/addresses" },
                // todo: map might hide the map function
                mapFields: { 
                    const: "id",
                    title: "line1"
                },
                // might work.  a different way though, don't put it in the schema
                //mapFunc: () => {this.schema.properties.physicalAddress.map((item)=>{return {const: item.line1} })}
            },
            postalAddress: {
                type: "number",
                inputType: "select",
                oneOf: { $ref: "#/data/addresses" },
                mapFields: { 
                    const: "id",
                    title: "line1"
                }
            },
            billingAddress: {
                type: "number",
                inputType: "select",
                oneOf: { $ref: "#/data/addresses" },
                mapFields: { 
                    const: "id",
                    title: "line1"
                }
            },
        },
        required: ["firstName", "lastName"],
    };

    // i want to infer a good form layout rather than just baby it, this method can just fuck off
    uischema = {
        type: "VerticalLayout",
        elements: [
            {
                type: "Group",
                label: "Personal Information",
                elements: [
                    {
                        type: "HorizontalLayout",
                        elements: [
                            {
                                type: "Control",
                                scope: "#/properties/firstName",
                            },
                            {
                                type: "Control",
                                scope: "#/properties/lastName",
                            },
                        ],
                    },
                    {
                        type: "HorizontalLayout",
                        elements: [
                            {
                                type: "Control",
                                scope: "#/properties/crmid",
                            },
                            {
                                type: "Control",
                                scope: "#/properties/dob",
                            },
                        ],
                    },
                    {
                        type: "Control",
                        scope: "#/properties/licenceNumber",
                    },
                    {
                        type: "Control",
                        scope: "#/properties/passedCreditCheck",
                    },
                    {
                        type: "Control",
                        scope: "#/properties/test",  
                        options: {
                            format: "radio"
                        }
                    },
                ],
            },
            {
                type: "Group",
                label: "Addresses",
                elements: [
                    {
                        type: "Control",
                        scope: "#/properties/addresses",
                        options: {
                            "elementLabelProp": "line1",
                            detail: {
                                type: "VerticalLayout",
                                elements: [
                                    {
                                        type: "Control",
                                        scope: "#/properties/name",
                                    },
                                    {
                                        type: "HorizontalLayout",
                                        elements: [
                                            {
                                                type: "Control",
                                                scope: "#/properties/line1",
                                            },
                                            {
                                                type: "Control",
                                                scope: "#/properties/line2",
                                            },
                                        ],
                                    },
                                    {
                                        type: "HorizontalLayout",
                                        elements: [
                                            {
                                                type: "Control",
                                                scope: "#/properties/postcode",
                                            },
                                            {
                                                type: "Control",
                                                scope: "#/properties/state",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        type: "HorizontalLayout",
                        elements: [
                            {
                                type: "Control",
                                scope: "#/properties/physicalAddress",
                                label: "Physical Address",
                                options: {
                                    "elementLabelProp": "line1"
                                }
                            },
                            {
                                type: "Control",
                                scope: "#/properties/postalAddress",
                                label: "Postal Address",
                            },
                            {
                                type: "Control",
                                scope: "#/properties/billingAddress",
                                label: "Billing Address",
                            },
                        ],
                    },
                ],
            },
            {
                type: "Group",
                label: "Metadata",
                elements: [
                    {
                        type: "Control",
                        scope: "#/properties/created",
                    },
                ],
            },
        ],
    };

    load = async () => {
        console.log('loading customer')
        
    }
}