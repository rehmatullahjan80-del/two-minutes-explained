"use client";
import { useState } from "react";

// Shows the thumbnail first and loads YouTube's player only once clicked, which keeps the page fast.
export default function Video({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="video">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          className="facade"
          aria-label={`Play video: ${title}`}
          onClick={(e) => {
            e.preventDefault();
            setPlay(true);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} width={480} height={360} />
          <span className="play" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
