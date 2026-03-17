import * as db from "../../lib/db";
import View from "./view"
import React from "react";
export default async function Page({ params }: { params: { form: string } }) {
  const p = await params;
  const form = p.form;

  try {
    const sp = await params;
    const items = await db.get(null, form);
    return (
      <div>
        <div>Current {form}</div>
        <div>
          <a href={`/forms/${form}/edit`}>new</a>
        </div>
        <div>
          {items.map((item) => (
            <div key={item.id?.toString()}>
              <hr />
              <a href={`/forms/${form}/edit?id=${item.id}`}>Edit</a> | <a href={`/forms/${form}/del?id=${item.id}`}>Delete</a>
              {/* <a onClick={showItem} data-id={item.id}>View</a> - if you're doing state stuff it needs to be in client*/}
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>
                  {key}: {String(value)}
                </p>
              ))}
            </div>
          ))}
        </div>
        <pre>{JSON.stringify(items, null, 2)}</pre>
        {/* <View schema={{}} document={viewItem} form="modems" ></View> */}
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    return <div>Error fetching {form}</div>;
  }
}
