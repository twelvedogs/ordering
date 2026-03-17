import * as db from "../lib/db";
// order schema
// todo: i'm not sure how to store the schemas really, maybe in the database?
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
    modemOptions = ['None Available'];
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

// not sure why this is required, maybe i'm loading the schemas on the client
// or before the app is initialised somewhere
// loads database driven options
export async function loadDynamic(schema){
  let modems = await db.get(null, 'modems');
  let modemSet = new Set(modems.map(modem => modem.name).filter((modemName) => modemName !== undefined));
  schema.properties.modemType.enum = [...modemSet];
  console.log('updated schema: ', schema);
}
