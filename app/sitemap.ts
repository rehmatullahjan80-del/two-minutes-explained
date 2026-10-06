import type { MetadataRoute } from "next";
import { SITE, clip, getTree } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = ["/", "/topics", "/about", "/contact"].map((u) => ({ url: SITE + u }));
  for (const s of await getTree()) {
    out.push({ url: `${SITE}/${s.slug}` });
    for (const m of s.modules)
      for (const t of m.topics)
        out.push({
          url: `${SITE}/${s.slug}/${m.slug}/${t.slug}`,
          lastModified: t.uploadDate ?? undefined,
          videos: [
            {
              title: t.title,
              thumbnail_loc: `https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`,
              description: clip(t.definition, 2000),
              player_loc: `https://www.youtube.com/embed/${t.videoId}`,
              publication_date: t.uploadDate ?? undefined,
            },
          ],
        });
  }
  return out;
}
