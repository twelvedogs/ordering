"use client";

import React, { useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import {
    materialCells,
    materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonEditor } from 'json-edit-react'
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import $RefParser from "@apidevtools/json-schema-ref-parser";

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

    const formChange = async ({ data, errors }: { data: any; errors: any[] }) => {
        let updatedSchema = await $RefParser.dereference({ schema, data }, { mutateInputSchema: false }) as any;
        setSchema(updatedSchema.schema);
        setData(data);
        setErrors(errors);
    }

    const updateState = (e) => {
        // i'm getting tired
        let datas = {...data};
        datas[e.target.id]=e.target.value;
        setData(datas);
    }

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
                if (result.errors)
                    error_message = result.errors.filter((error) => { error_message += `${error.argument}:  ${error.name}\n`; return true; });

                alert(`Failed to save ${form}\n${error_message}`);
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    function camelCaseToWords(s: string) {
        const result = s.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    // there's better json schema form generators but the weight and difficulty of bending them to my way of thinking isn't worth not
    // writing 200 lines of code
    function drawProps(obj, objName) {
        let result = [];
        console.log('Generating form');
        for (const i in obj) {
            if (Object.hasOwn(obj, i)) {
                console.log(`i: ${i}`, obj[i])
                if (obj[i].inputType) {
                    switch (obj[i].inputType) {
                        case "number":
                            result.push(<div key={i} className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                                <input className="form-control" data-field={i} type="number" id={i} onChange={updateState} value={data[i]}></input></div>);
                            break;
                        case "checkbox":
                            result.push(<div key={i} className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                                <input className="form-control" data-field={i} type="checkbox" id={i} onChange={updateState}></input></div>);
                            break;
                        case "date":
                            result.push(<div key={i} className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                                <input className="form-control" data-field={i} type="date" id={i} onChange={updateState}></input></div>);
                            break;
                        case "file":
                            result.push(<div key={i} className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                                <input className="form-control" data-field={i} type="file" id={i} onChange={updateState}></input></div>);
                            break;
                        case "select":
                            // if obj[i].mapFields or something prolly
                            // todo: on dereference map the fields
                            let options =[];
                            if(obj[i].mapFields){
                                // options = obj[i].oneOf.map((option)=>{return {const: option[obj[i].mapFields.const], title: option[obj[i].mapFields.title]}});
                                options = obj[i].oneOf.map((option, j)=>{return {const: j, title: option[obj[i].mapFields.title]}});
                                console.log(options);
                            }else{
                                options = obj[i].oneOf;
                            }

                            result.push(<div key={i} className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                                <select className="form-control" data-field={i} id={i} onChange={updateState}>
                                {Object.keys(options).map((j) => (
                                    <option key={options[j]['const']}>{options[j]['title']}</option>
                                ))}
                                </select></div>);
                            break;
                        case "hidden":
                            result.push(<input key={i} className="form-control" data-field={i} type="text" id={i} onChange={updateState}></input>);
                            break;
                    }
                } else {
                    // result.push(<div className="form-group"><label htmlFor={i}>{camelCaseToWords(i)}</label>
                    // <input className="form-control" data-field={i} type="text" id={i} onChange={updateState} value={data[i]}></input></div>);
                    result.push(<div key={i} className="form-group">{camelCaseToWords(i)}: no inputType set for {i}</div>);
                }
            }
        }
        return result;
    }

    return (
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
            {drawProps(schema.properties, 'properties')}
            <input type="text" value={data.id || ''} readOnly></input>
            <button type="submit" disabled={errors.length > 0}>Save {form}</button>
            <p>Data</p>
            <JsonEditor
                data={{ data, dschema, errors }}
            // setData={ setJsonData } // optional
            // { ...otherProps } 
            />
            <div style={{ height: 500 }}></div>
        </form>
    );
}
