// app/providers.tsx
"use client";
import { useEffect } from "react";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return <>{children}</>;
}
