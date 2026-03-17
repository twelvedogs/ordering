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
  console.log('loading schema', schema);
  const [data, setData] = useState(document || {});
  //const [data, setData] = useState({});

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
        //alert('Form Saved');
        // todo: some kind of feedback
        // todo: put the redirection the return object
        window.location.replace(`/forms/${form}/`);
      } else {
        const result = await response.json();
        console.log(`Failed to save ${form}:`, response.statusText);
        // {"error":"Form failed validation.","ok":false,"errors":[{"path":[],"property":"instance","message":"requires property \"name\"","schema":{"type":"object","properties":{"modemId":{"type":"number"},"name":{"type":"string","minLength":2},"price":{"type":"string","minLength":2},"brand":{"type":"number"},"active":{"type":"string"}},"required":["name","price"]},"instance":{"id":"96c76096-f8f7-494f-a19e-2d66639282c4"},"name":"required","argument":"name","stack":"instance requires property \"name\""},{"path":[],"property":"instance","message":"requires property \"price\"","schema":{"type":"object","properties":{"modemId":{"type":"number"},"name":{"type":"string","minLength":2},"price":{"type":"string","minLength":2},"brand":{"type":"number"},"active":{"type":"string"}},"required":["name","price"]},"instance":{"id":"96c76096-f8f7-494f-a19e-2d66639282c4"},"name":"required","argument":"price","stack":"instance requires property \"price\""}]}
        let error_message ='';
        // todo: don't use filter
        result.errors.filter((error) => { error_message += `${error.argument}:  ${error.name}\n`; return true;  });

        alert(`Failed to save ${form}\n${error_message}`);
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
        <input type="text" value={data.id || ''} readOnly></input>
      <button type="submit">Save {form}</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
}
