import type { Metadata } from "next";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default async function About() {
  const s = await getSite();
  return (
    <div className="narrow">
      <h1>About</h1>
      {(s.about || s.tagline).split(/\n\s*\n/).filter(Boolean).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
