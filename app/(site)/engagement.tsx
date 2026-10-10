"use client";

import { useEffect, useState } from "react";

export default function Engagement({ slug, title, shareUrl }: { slug: string; title: string; shareUrl: string }) {
  const key = `two-minutes-engagement:${slug}`;
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return;
      const parsed = JSON.parse(value) as { count?: number; liked?: boolean };
      setCount(Number(parsed.count ?? 0));
      setLiked(Boolean(parsed.liked));
    } catch {
      // Ignore invalid persisted state.
    }
  }, [key]);

  const persist = (nextCount: number, nextLiked: boolean) => {
    try {
      localStorage.setItem(key, JSON.stringify({ count: nextCount, liked: nextLiked }));
    } catch {
      // Ignore storage failures from private browsing or restrictions.
    }
  };

  const handleLike = () => {
    if (liked) return;
    const nextCount = count + 1;
    setCount(nextCount);
    setLiked(true);
    persist(nextCount, true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // Fall through to clipboard copy if the share dialog is dismissed.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  return (
    <div className="engagement">
      <button type="button" className="reaction" onClick={handleLike} disabled={liked} aria-label={liked ? "You liked this video" : "Like this video"}>
        <span aria-hidden="true">♥</span>
        <span>{liked ? "Liked" : "Like"}</span>
        <strong>{count}</strong>
      </button>
      <button type="button" className="share" onClick={handleShare}>
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
