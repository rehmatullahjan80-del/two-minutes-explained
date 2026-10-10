import Link from "next/link";
import type { Metadata } from "next";
import Video from "../../../video";
import Engagement from "../../../engagement";
import { SITE, clip, getTree, findTopic } from "@/lib/content";

type P = { subject: string; mod: string; topic: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTree()).flatMap((s) =>
    s.modules.flatMap((m) => m.topics.map((t) => ({ subject: s.slug, mod: m.slug, topic: t.slug })))
  );
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { subject, mod, topic } = await params;
  const { t } = await findTopic(subject, mod, topic);
  const url = `/${subject}/${mod}/${topic}`;
  const title = `${t.title} explained in 2 minutes`;
  const description = clip(t.definition);
  const image = `https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "video.other", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Topic({ params }: { params: Promise<P> }) {
  const { subject, mod, topic } = await params;
  const { s, m, t, prev, next } = await findTopic(subject, mod, topic);
  const base = `/${subject}/${mod}`;
  const shareUrl = `${SITE}/${subject}/${mod}/${topic}`;
  const added = t.uploadDate
    ? new Date(t.uploadDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : "";

  const video = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: t.title,
    description: t.definition,
    thumbnailUrl: [`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`],
    uploadDate: t.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${t.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${t.videoId}`,
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: s.title, item: `${SITE}/${subject}` },
      { "@type": "ListItem", position: 3, name: t.title },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([video, crumbs]) }} />
      <p className="crumbs">
        <Link href={`/${subject}`}>{s.title}</Link> / {m.title}
      </p>
      <h1>{t.title}</h1>
      <p className="definition">{t.definition}</p>
      <Video id={t.videoId} title={t.title} />
      <Engagement slug={`${subject}/${mod}/${topic}`} title={t.title} shareUrl={shareUrl} />
      {added && (
        <p className="crumbs">
          Added <time dateTime={t.uploadDate ?? ""}>{added}</time>
        </p>
      )}
      {t.notes.split(/\n\s*\n/).filter(Boolean).map((p, j) =>
        p.startsWith("## ") ? <h2 key={j}>{p.slice(3)}</h2> : <p key={j}>{p}</p>
      )}
      {t.keyPoints.length > 0 && (
        <aside className="remember">
          <h2>Remember this</h2>
          <ul>
            {t.keyPoints.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </aside>
      )}
      {m.topics.length > 1 && (
        <section>
          <h2>More in {m.title}</h2>
          <ul>
            {m.topics.filter((x) => x.slug !== t.slug).slice(0, 6).map((x) => (
              <li key={x.slug}>
                <Link href={`${base}/${x.slug}`}>{x.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <nav className="pager" aria-label="Previous and next topic">
        {prev && (
          <Link href={`${base}/${prev.slug}`}>
            <small>Previous</small>
            {prev.title}
          </Link>
        )}
        {next && (
          <Link href={`${base}/${next.slug}`} className="next">
            <small>Next</small>
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  );
}
