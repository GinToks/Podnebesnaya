"use client";

import { useEffect, useState } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finish = () => setLoading(false);
    if (document.readyState === "complete") {
      finish();
      return;
    }
    const onLoad = () => finish();
    window.addEventListener("load", onLoad, { once: true });
    const fallback = window.setTimeout(finish, 2500);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      {children}
      {loading && <LoadingAnimation />}
    </>
  );
}
