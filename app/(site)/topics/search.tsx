"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";
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

function shareTopic(href: string, title: string) {
  const absolute = href.startsWith("http") ? href : `${SITE}${href}`;
  if (navigator.share) {
    navigator
      .share({ title, url: absolute })
      .catch(() => {
        void navigator.clipboard.writeText(absolute);
      });
    return;
  }

  void navigator.clipboard.writeText(absolute);
}

function previewText(value: string, max = 180) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export default function TopicSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
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

  const moduleOptions = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      const segments = item.href.split("/").filter(Boolean);
      if (segments.length >= 2) {
        const value = `${segments[0]}/${segments[1]}`;
        if (!map.has(value)) map.set(value, item.group);
      }
    });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [items]);

  const filteredIndex = moduleFilter === "all" ? index : index.filter((i) => i.href.includes(`/${moduleFilter}/`));

  const ws = toWords(q);
  const ranked = ws.length
    ? filteredIndex
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
    : filteredIndex.map((i) => ({ i, hit: 0, total: 0 }));
  const exactCount = ranked.filter((r) => ws.length > 0 && r.hit === ws.length).length;
  const list = ranked.slice(0, 20);

  return (
    <>
      <div className="module-picker-wrap">
        <label htmlFor="module-filter" className="sr-only">
          Filter by module
        </label>
        <select
          id="module-filter"
          className="module-picker"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          aria-label="Browse modules"
        >
          <option value="all">Browse all modules</option>
          {moduleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
      <ul className="topic-list">
        {list.map(({ i }) => (
          <li key={i.href} className="topic-card">
            <div className="topic-card__toolbar">
              <button
                type="button"
                className="topic-card__share"
                onClick={() => shareTopic(i.href, i.title)}
                aria-label={`Share ${i.title}`}
              >
                Share
              </button>
            </div>
            <Link href={i.href} className="topic-card__media" aria-label={`Open ${i.title}`}>
              {i.thumbnailUrl ? (
                <img src={i.thumbnailUrl} alt={i.title} width={640} height={360} />
              ) : (
                <div className="topic-card__fallback">Video</div>
              )}
            </Link>
            <div className="topic-card__body">
              <div className="topic-card__meta">{i.group}</div>
              <Link href={i.href} className="topic-card__title">
                {i.title}
              </Link>
              <p className="topic-card__preview">{previewText(i.text || i.definition, 220)}</p>
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="topic-empty">No topics match “{q}”. Try a different word.</li>}
      </ul>
    </>
  );
}
