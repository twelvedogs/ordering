"use client";

import React, { useState, useEffect } from "react";
import { JsonEditor } from 'json-edit-react'
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { drawProps } from "@/app/components/formBuilder";
import Alert from 'react-bootstrap/Alert';

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
    const [dschema, setSchema] = useState(schema || {});

    // form error object
    const [errors, setErrors] = useState([]);
    const [serverResponse, setServerResponse] = useState('');
    const [showJson, setShowJson] = useState(false);

    // update the form if it's stuff has changed i guess
    const formChange = async ({ data, errors }: { data: any; errors: any[] }) => {
        let updatedSchema = await $RefParser.dereference({ schema, data }, { mutateInputSchema: false }) as any;
        setSchema(updatedSchema.schema);
        setData(data);
        setErrors(errors);
    }

    // unwrap the state and set the correct key with the new value
    const updateState = (e) => {
        // i'm getting tired
        let datas = {...data};

        try{
            // select
            if(e.target.type === "select-one")
                datas[e.target.dataset.field] = schema.properties[e.target.dataset.field].anyOf[e.target.value];
            else if (e.target.type === "checkbox")
                datas[e.target.dataset.field]=e.target.checked;
            else
                // id is prefixed by form name (later)
                datas[e.target.dataset.field]=e.target.value;
        }catch(ex){
            console.log(ex);
        }

        setData(datas);
    }

    // handle save click event
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        // if(errors.length>0) return;
        event?.preventDefault();
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
                if (result.errors){
                    error_message = result.errors.filter((error) => { error_message += `${error.argument}:  ${error.name}\n`; return true; });
                    setServerResponse(error_message);
}
                // alert(`Failed to save ${form}\n${error_message}`);
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    
    return (
        <div style={{width: "100%", display: "flex", alignContent:"center", flexWrap: "wrap", border:"1px solid black" }}>
        <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 2000, border: "1px solid green", margin: "auto" }}>
            <div className="col-lg-12">
                {drawProps(schema.properties, 'properties', updateState, data)}
                <input type="hidden" value={data.id || ''} readOnly></input>
                {/* <button type="submit" className="btn btn-primary" disabled={errors.length > 0}>Submit {form}</button> */}
                <button type="button" onClick={()=>{handleSubmit(null)}} className="btn btn-primary" disabled={errors.length > 0}>Save {form}</button>
            </div>

            <p onClick={() => setShowJson(!showJson)}>Data</p>
            <div style={{visibility: showJson ? "visible": "hidden"}}>

            <JsonEditor
                data={{ data, dschema, errors }}
            // setData={ setJsonData } // optional
            // { ...otherProps } 
            />
            </div><div className="col-lg-2">
                {serverResponse}
            </div>
            <div style={{ height: 500 }}></div>
        </form>            </div>
    );
}
