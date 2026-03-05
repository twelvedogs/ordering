export function createSchema() {
  return {
    type: "object",
    properties: {
      modemId: { type: "number" },
      name: { type: "string", minLength: 2 },
      price: { type: "string", minLength: 2 },
      brand: { type: "number" },
      active: { type: "string" },
    },
    required: ["name", "price"],
  };
}
