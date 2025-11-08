"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { createSchema } from "../../schemas/user";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User saved:", result);
        alert("User saved successfully!");
        // Optionally, redirect or show a success message
      } else {
        console.error("Failed to save user:", response.statusText);
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
      <button type="submit">Save User</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
}
