// Function to generate schema with dynamic modem options
export function createSchema(modemOptions: string[]) {
  return {
    type: "object",
    properties: {
      firstName: { type: "string", minLength: 2 },
      age: { type: "number" },
      modemType: { type: "string", enum: modemOptions },
    },
    required: ["firstName"],
  };
}

export const uischema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/firstName" },
    { type: "Control", scope: "#/properties/age" },
    {
      type: "Control",
      scope: "#/properties/modemType",
      options: { autocomplete: true },
    },
  ],
};
