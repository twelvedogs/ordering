// not sure if this is the right object structure
const Address = {
    type: "object",
    properties: {
        name: { type: "string" },
        line1: { type: "string" },
        line2: { type: "string"},
        postcode: { type: "number", minLength: 4 },
        state: { type: "string"}

    },required: [ "line1", "postcode", "state" ]
}

export class Customer { 
    schema = {
        type: "object",
        properties: {
            crmid: { type: "number" },
            firstName: { type: "string", minLength: 2 },
            lastName: { type: "string", minLength: 2 },
            licenceNumber: { type: "string", readOnly: true },
            dob: { type: "string", format: "date" },
            created: { type: "string", format: "date" },
            passedCreditCheck: { type: "boolean" },
            addresses: { type: "array", items: Address},
            // use array index or should i add an id field to the address?
            physicalAddress: { type: "number", 
                options: { $ref: "#/properties/addresses"}
            },
            postalAddress: { type: "number",
                options: { $ref: "#/properties/addresses"}
            },
            billingAddress: { type: "number",
                options: { $ref: "#/properties/addresses"}
            },
        },
        required: ["firstName", "lastName"],
    };

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

    }
}