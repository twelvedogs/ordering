"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";

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
  const [data, setData] = useState(document || {});
  return (
      <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}
