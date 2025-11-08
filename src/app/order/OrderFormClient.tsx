"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { createSchema } from "../schemas/user";
//import { uischema } from "../schemas/user";

interface OrderFormClientProps {
  modemOptions: string[];
}

export default function OrderFormClient({
  modemOptions,
}: OrderFormClientProps) {
  const [data, setData] = useState({});

  // Create schema with dynamic modem options
  const schema = createSchema(modemOptions);

  return (
    <div style={{ padding: 20 }}>
      <JsonForms
        schema={schema}
        // uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
