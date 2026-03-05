export function createSchema() {
  return {
    type: "object",
    properties: {
      crmid: { type: "number" },
      firstName: { type: "string", minLength: 2 },
      lastName: { type: "string", minLength: 2 },
      contract: { type: "string", readOnly: true },
      licence: { type: "string", readOnly: true },
      dob: { type: "date", readOnly: true },
      created: { type: "date" },
    },
    required: ["firstName", "lastName"],
  };
}
