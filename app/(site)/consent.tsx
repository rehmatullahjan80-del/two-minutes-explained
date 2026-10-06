"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(!localStorage.getItem("consent"));
    } catch {}
  }, []);

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem("consent", value);
    } catch {}
    window.gtag?.("consent", "update", { analytics_storage: value });
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="consent" role="dialog" aria-label="Cookie consent">
      <p>We use cookies to understand how this site is used. You can accept or decline.</p>
      <div>
        <button onClick={() => choose("denied")}>Decline</button>
        <button onClick={() => choose("granted")}>Accept</button>
      </div>
    </div>
  );
}
