export const schema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 2 },
    age: { type: "number" },
  },
  required: ["firstName"],
};

export const uischema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/firstName" },
    { type: "Control", scope: "#/properties/age" },
  ],
};
