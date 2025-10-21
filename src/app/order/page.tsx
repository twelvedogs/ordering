"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import * as user from "../schemas/user";

export default function JsonForm() {
  const [data, setData] = useState({});

  return (
    <div style={{ padding: 20 }}>
      <JsonForms
        schema={user.schema}
        uischema={user.uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
