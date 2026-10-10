import { createReader } from "@keystatic/core/reader";
import { SITE } from "./site";
import config from "../keystatic.config";

export { SITE };
const reader = createReader(process.cwd(), config);

const byOrder = (a: { order: number | null }, b: { order: number | null }) => (a.order ?? 0) - (b.order ?? 0);

export function youtubeId(input: string) {
  const value = input.trim();
  if (!value || /replace_with|example\.com|placeholder/i.test(value)) {
    return "";
  }

  const m = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : value;
}

export const clip = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

// subject → modules → topics. Orphans (e.g. topics of a deleted module) are simply left out.
export async function getTree() {
  const [subjects, modules, topics] = await Promise.all([
    reader.collections.subjects.all(),
    reader.collections.modules.all(),
    reader.collections.topics.all(),
  ]);
  return subjects
    .map((s) => ({
      ...s.entry,
      slug: s.slug,
      modules: modules
        .filter((m) => m.entry.subject === s.slug)
        .map((m) => ({
          ...m.entry,
          slug: m.slug,
          topics: topics
            .filter((t) => t.entry.module === m.slug)
            .map((t) => ({ ...t.entry, slug: t.slug, videoId: youtubeId(t.entry.videoUrl) }))
            .sort(byOrder),
        }))
        .sort(byOrder),
    }))
    .sort(byOrder);
}

export async function findTopic(subject: string, mod: string, topic: string) {
  const s = (await getTree()).find((x) => x.slug === subject)!;
  const m = s.modules.find((x) => x.slug === mod)!;
  const i = m.topics.findIndex((x) => x.slug === topic);
  return { s, m, t: m.topics[i], prev: m.topics[i - 1], next: m.topics[i + 1] };
}

export type Tree = Awaited<ReturnType<typeof getTree>>;
export type SearchItem = {
  href: string;
  title: string;
  definition: string;
  group: string;
  text: string;
  thumbnailUrl?: string;
};

// Flattens the tree into search items. Pass a subject slug to scope to one subject (group = module name);
// omit it to cover the whole site (group = "Subject / Module").
export function searchItems(tree: Tree, subjectSlug?: string): SearchItem[] {
  const subjects = subjectSlug ? tree.filter((s) => s.slug === subjectSlug) : tree;
  return subjects.flatMap((s) =>
    s.modules.flatMap((m) =>
      m.topics.map((t) => ({
        href: `/${s.slug}/${m.slug}/${t.slug}`,
        title: t.title,
        definition: t.definition,
        group: subjectSlug ? m.title : `${s.title} / ${m.title}`,
        text: `${t.notes} ${t.keyPoints.join(" ")}`,
        thumbnailUrl: t.videoId ? `https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg` : undefined,
      }))
    )
  );
}

export async function getSite() {
  const s = await reader.singletons.site.read();
  return {
    siteName: s?.siteName || "2 Minutes Explained",
    tagline: s?.tagline || "",
    about: s?.about || "",
    contactEmail: s?.contactEmail || "",
    youtubeUrl: s?.youtubeUrl || "",
  };
}
