"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

function formatStars(n: number) {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}k`;
}

/** "Star" button. The brass medal appears only once GitHub has given the real count. */
export function StarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`https://api.github.com/repos/${site.repoSlug}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (live && typeof data?.stargazers_count === "number") setStars(data.stargazers_count);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <a className="btn btn-l btn-s" href={site.repo}>
      Star
      {stars !== null ? (
        <span className="medal">
          <span className="sr-only">on GitHub, </span>
          {formatStars(stars)}
          <span className="sr-only"> stars</span>
        </span>
      ) : (
        <span className="sr-only"> bragkit on GitHub</span>
      )}
    </a>
  );
}
