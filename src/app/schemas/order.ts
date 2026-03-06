import * as db from "../lib/db";
// order schema
// todo: i'm not sure how to store the schemas really, maybe in the database?
// i think the best way is to specify them in code, maybe use mongoose but
// i don't really see the need for that, depends on how i end up doing them i guess
// would be good to have more knowledge of what mongoose can do
// todo: allow datastores to be defined as enums
export async function createSchema(modemOptions: string[] = null) {
  var planOptions = ["Basic", "Premium", "Enterprise"];
  var serviceOptions = [
    "FTTN Fibre to the Node",
    "FTTB Fibre To The Basement",
    "FTTP Fibre to the Premises",
    "FTTC Fibre to the Curb",
  ];

  if(modemOptions === null){
    modemOptions = await db.get(null, "modems");
  }

  return {
    type: "object",
    properties: {
      orderId: { type: "number" },
      crmid: { type: "number" },
      firstName: { type: "string", minLength: 2 },
      lastName: { type: "string", minLength: 2 },
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
    required: ["firstName", "lastName"],
  };
}
