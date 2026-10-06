import type { Metadata } from "next";
import TopicSearch from "../topics/search";
import { getTree, searchItems } from "@/lib/content";

type P = { subject: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTree()).map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { subject } = await params;
  const s = (await getTree()).find((x) => x.slug === subject)!;
  return { title: s.title, description: s.description, alternates: { canonical: `/${subject}` } };
}

export default async function Subject({ params }: { params: Promise<P> }) {
  const { subject } = await params;
  const tree = await getTree();
  const s = tree.find((x) => x.slug === subject)!;
  return (
    <div className="narrow">
      <h1>{s.title}</h1>
      <p className="lead">{s.description}</p>
      <TopicSearch items={searchItems(tree, subject)} />
    </div>
  );
}
