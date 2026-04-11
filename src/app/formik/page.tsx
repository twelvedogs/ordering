import Client from "./client";

// server side of the edit page
export default async function Page() {
    try {
        // insert the client side code
        return (
            <div>
                <Client />
            </div>
        );
    } catch (error) {
        console.error("Database error:", error);
        // Fallback to default options on error
        return <Client />;
    }
}
