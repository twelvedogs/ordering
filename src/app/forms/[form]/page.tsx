import * as db from "../../lib/db";

export default async function Page({ params }: { params: { form: string } }) {
  const p = await params;
  const form = p.form;
  console.log('forms thing ', form);
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
            <div key={item._id?.toString()}>
              <hr />
              not sure how to switch to edit func, probably just replace list -{" "}
              this should probably be handled in routes
              <a href={`/forms/${form}/edit?_id=${item._id}`}>Edit</a>
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>
                  {key}: {String(value)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    return <div>Error fetching {form}</div>;
  }
}
