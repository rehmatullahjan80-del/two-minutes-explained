import Link from "next/link";
import Slider from "./slider";
import { SITE, getTree, getSite } from "@/lib/content";

export default async function Home() {
  const [tree, site] = await Promise.all([getTree(), getSite()]);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: site.siteName, url: SITE, description: site.tagline || undefined },
      { "@type": "Organization", name: site.siteName, url: SITE, sameAs: site.youtubeUrl ? [site.youtubeUrl] : undefined },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="hero">
        <p className="lead">{site.tagline || "Pick a subject to find the notes and recap for every video."}</p>
      </div>
      <Slider>
        {tree.map((s) => (
          <Link key={s.slug} href={`/${s.slug}`} className="card">
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </Link>
        ))}
      </Slider>
    </>
  );
}
