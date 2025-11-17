"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { createSchema } from "../../schemas/order";
//import { uischema } from "../schemas/order";

interface OrderFormClientProps {
  modemOptions: string[];
  order?: any;
}

export default function OrderFormClient({
  modemOptions,
  order,
}: OrderFormClientProps) {
  const [data, setData] = useState(order || {});

  // Create schema with dynamic modem options
  const schema = createSchema(modemOptions);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("order saved:", result);
        alert("order saved successfully!");
        // Optionally, redirect or show a success message
      } else {
        console.error("Failed to save order:", response.statusText);
        // Optionally, show an error message
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
      <button type="submit">Save order</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
}
