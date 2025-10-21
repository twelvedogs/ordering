"use client";

import { useEffect, useState } from "react";

export default function ModemsPage() {
  const [modems, setModems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/modems")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setModems(data.data);
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Modems</h1>
      <pre>{JSON.stringify(modems, null, 2)}</pre>
    </div>
  );
}
