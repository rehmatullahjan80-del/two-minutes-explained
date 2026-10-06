import type { Metadata } from "next";
import TopicSearch from "./search";
import { getTree, searchItems } from "@/lib/content";

export const metadata: Metadata = { title: "All topics", alternates: { canonical: "/topics" } };

export default async function Topics() {
  const items = searchItems(await getTree());
  return (
    <div className="narrow">
      <h1>All topics</h1>
      <p className="lead">Search every video note in one place.</p>
      <TopicSearch items={items} />
    </div>
  );
}
