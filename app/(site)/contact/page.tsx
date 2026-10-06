import type { Metadata } from "next";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Contact us", alternates: { canonical: "/contact" } };

export default async function Contact() {
  const s = await getSite();
  return (
    <div className="narrow">
      <h1>Contact us</h1>
      <p>Questions, corrections, and topic requests are welcome.</p>
      {s.contactEmail && (
        <p>Email: <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></p>
      )}
      {s.youtubeUrl && (
        <p>YouTube: <a href={s.youtubeUrl}>Visit the channel</a></p>
      )}
    </div>
  );
}
