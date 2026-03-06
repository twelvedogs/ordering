"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";

interface ClientProps {
  schema?: object;
  document?: any;
  form: string;
}

// this is a client side function, stop making db calls in it!
export default function Client({
  schema,
  document,
  form
}: ClientProps) {
  console.log('loading document', document);
  const [data, setData] = useState(document || {});

  // handle save click event
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/crud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({form, data}),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${form} saved:`, result);
        alert('Form Saved');
        window.location.replace(`/forms/${form}/`);
      } else {
        console.error(`Failed to save ${form}:`, response.statusText);
        alert(`Failed to save ${form}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <JsonForms
        schema={schema}
        // uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
        <input type="text" value={data._id}></input>
      <button type="submit">Save {form}</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
}
