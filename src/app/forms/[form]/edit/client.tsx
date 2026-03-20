"use client";

import React, { useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import {
    materialCells,
    materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonEditor } from 'json-edit-react'
import { JsonSchema, UISchemaElement } from "@jsonforms/core";

interface ClientProps {
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    document?: any;
    form: string;
}

// this is a client side function, stop making db calls in it!
export default function Client({
    schema,
    uischema,
    document,
    form
}: ClientProps) {
    const [data, setData] = useState(document || {});
    // form error object
    const [errors, setErrors] = useState([]);
    // const [updatedSchema, setUpdatedSchema] = useState(schema);

    // this is dumb just use $ref
    // useEffect(() => {
    //     if (data?.addresses && Array.isArray(data.addresses) && updatedSchema) {
    //         const addressIds = data.addresses.map((addr: any, idx: number) => 
    //             addr.id || `address-${idx}`
    //         );
            
    //         // Create a deep copy and update the enum values
    //         const newSchema = JSON.parse(JSON.stringify(updatedSchema));
    //         if (newSchema.properties?.physicalAddress) {
    //             newSchema.properties.physicalAddress.enum = addressIds;
    //         }
    //         if (newSchema.properties?.postalAddress) {
    //             newSchema.properties.postalAddress.enum = addressIds;
    //         }
            
    //         setUpdatedSchema(newSchema);
    //     }
    // }, [data?.addresses]);

    // handle save click event
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        // if(errors.length>0) return;

        event.preventDefault();
        try {
            const response = await fetch("/api/crud", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ form, data }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`${form} saved:`, result);
                // todo: some kind of feedback
                // todo: put the redirection the return object
                window.location.replace(`/forms/${form}/`);
            } else {
                const result = await response.json();
                console.log(`Failed to save ${form}:`, response.statusText);
                // {"error":"Form failed validation.","ok":false,"errors":[{"path":[],"property":"instance","message":"requires property \"name\"","schema":{"type":"object","properties":{"modemId":{"type":"number"},"name":{"type":"string","minLength":2},"price":{"type":"string","minLength":2},"brand":{"type":"number"},"active":{"type":"string"}},"required":["name","price"]},"instance":{"id":"96c76096-f8f7-494f-a19e-2d66639282c4"},"name":"required","argument":"name","stack":"instance requires property \"name\""},{"path":[],"property":"instance","message":"requires property \"price\"","schema":{"type":"object","properties":{"modemId":{"type":"number"},"name":{"type":"string","minLength":2},"price":{"type":"string","minLength":2},"brand":{"type":"number"},"active":{"type":"string"}},"required":["name","price"]},"instance":{"id":"96c76096-f8f7-494f-a19e-2d66639282c4"},"name":"required","argument":"price","stack":"instance requires property \"price\""}]}
                let error_message = '';
                // todo: don't use filter
                if(result.errors)
                    error_message = result.errors.filter((error) => { error_message += `${error.argument}:  ${error.name}\n`; return true; });

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
                uischema={uischema}
                data={data}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data, errors }) => { setData(data); setErrors(errors) }}
            />
            <input type="text" value={data.id || ''} readOnly></input>
            <button type="submit" disabled={errors.length > 0}>Save {form}</button>
            <p>Data</p>
            <JsonEditor
                data={{data, schema, uischema, errors}}
            // setData={ setJsonData } // optional
            // { ...otherProps } 
            />
            <div style={ { height:  500 } }></div>
        </form>
    );
}
