// Function to generate schema with dynamic modem options
export function createSchema(modemOptions: string[]) {
  var planOptions = ["Basic", "Premium", "Enterprise"];
  var serviceOptions = [
    "FTTN Fibre to the Node",
    "FTTB Fibre To The Basement",
    "FTTP Fibre to the Premises",
    "FTTC Fibre to the Curb",
  ];

  return {
    type: "object",
    properties: {
      firstName: { type: "string", minLength: 2 },
      age: { type: "number" },
      modemType: { type: "string", enum: modemOptions },
      serviceType: { type: "string", enum: serviceOptions },
      plan: { type: "string", enum: planOptions },
      quota: { type: "string", readOnly: true },
      speed: { type: "string", readOnly: true },
      contract: { type: "string", readOnly: true },
      customerReference: { type: "string" },
      newConnection: { type: "string", enum: ["New", "Existing"] },
    },
    required: ["firstName"],
  };
}

// export const uischema = {
//   type: "VerticalLayout",
//   elements: [
//     { type: "Control", scope: "#/properties/firstName" },
//     { type: "Control", scope: "#/properties/age" },
//     { type: "Control", scope: "#/properties/serviceType" },
//     { type: "Control", scope: "#/properties/plan" },
//     { type: "Control", scope: "#/properties/quota" },
//     { type: "Control", scope: "#/properties/speed" },
//     { type: "Control", scope: "#/properties/contract" },
//     { type: "Control", scope: "#/properties/customerReference" },
//     {
//       type: "Control",
//       scope: "#/properties/newConnection",
//       oneOf: [
//         {
//           const: "new",
//           title: "New Connection",
//         },
//         {
//           const: "existing",
//           title: "Churn Existing Connection",
//         },
//       ],
//     },
//     { type: "Control", scope: "#/properties/connectionFee" },
//     {
//       type: "Control",
//       scope: "#/properties/modemType",
//       options: { autocomplete: true },
//     },
//   ],
// };
