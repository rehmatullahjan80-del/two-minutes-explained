"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/content";

const norm = (s: string) => s.toLowerCase().replace(/[\s\-_.,:;!?()'"\/\\]+/g, " ").trim();
const toWords = (s: string) => norm(s).split(" ").filter(Boolean);

function lev(a: string, b: string) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}

// 1 = exact word, 0.8 = part of a word, 0.5 = close spelling (typo), 0 = no match
function match(w: string, words: string[]) {
  let best = 0;
  for (const x of words) {
    if (x === w) return 1;
    if (w.length >= 2 && x.includes(w)) best = Math.max(best, 0.8);
    else if (w.length >= 4 && Math.abs(x.length - w.length) <= 2 && lev(w, x) <= (w.length >= 8 ? 2 : 1)) best = Math.max(best, 0.5);
  }
  return best;
}

export default function TopicSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const index = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        title_w: toWords(i.title),
        def_w: toWords(i.definition),
        group_w: toWords(i.group),
        text_w: toWords(i.text),
      })),
    [items]
  );

  const ws = toWords(q);
  const ranked = ws.length
    ? index
        .map((i) => {
          let hit = 0;
          let total = 0;
          for (const w of ws) {
            const s = Math.max(3 * match(w, i.title_w), 2 * match(w, i.def_w), match(w, i.group_w), 0.5 * match(w, i.text_w));
            if (s > 0) {
              hit++;
              total += s;
            }
          }
          return { i, hit, total };
        })
        .filter((r) => r.hit > 0)
        .sort((a, b) => b.hit - a.hit || b.total - a.total)
    : index.map((i) => ({ i, hit: 0, total: 0 }));
  const exactCount = ranked.filter((r) => ws.length > 0 && r.hit === ws.length).length;
  const list = ranked.slice(0, 20);

  return (
    <>
      <input
        type="search"
        className="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search topics, e.g. handshake or TTL"
        aria-label="Search topics"
      />
      {ws.length > 0 && list.length > 0 && (
        <p className="lead" aria-live="polite">
          {exactCount === 0
            ? "No exact match. Closest topics:"
            : `${exactCount} ${exactCount === 1 ? "topic" : "topics"} found${exactCount < ranked.length ? ", then close matches" : ""}`}
        </p>
      )}
      <ul className="list">
        {list.map(({ i }) => (
          <li key={i.href}>
            <Link href={i.href}>{i.title}</Link>
            <p>{i.definition}</p>
            <small>{i.group}</small>
          </li>
        ))}
        {list.length === 0 && <li>No topics match “{q}”. Try a different word.</li>}
      </ul>
    </>
  );
}
