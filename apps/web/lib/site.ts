// Real destinations only. Docs, npm, changelog, patrons and X get links once they exist.
const repo = "https://github.com/Raviraghul2005/bragkit";

export const site = {
  repo,
  /** owner/name for the GitHub API. */
  repoSlug: "Raviraghul2005/bragkit",
  issues: `${repo}/issues`,
  newIssue: `${repo}/issues/new`,
  suggestExhibit: `${repo}/issues/new?template=suggest-an-exhibit.yml`,
  signBook: `${repo}/issues/new?title=${encodeURIComponent("Visitors' book: ")}`,
  curator: "Ravi Raghul",
  /** GitHub user whose public pushes drive the demo streak. */
  streakUser: "Raviraghul2005",
  install: "npm i bragkit",
};

/**
 * The maintainer's real status, shown by the demo Status Card. Progress is the share of
 * PLAN.md steps that are done (1, 2, 4 and 5 of 6); update it as steps land.
 */
export const currentBuild = {
  title: "The Bragkit v1 collection",
  since: "2026-11-13",
  progress: 67,
};

/** Bragkit's own tools, for the demo Tech Stack Shelf. */
export const ownStack = ["TypeScript", "React", "Next.js", "Vitest", "Vercel"];

/** The track on display in every Now Playing demo. Static in v1: no Spotify, no keys. */
export const demoTrack = {
  track: "Baby",
  artist: "Justin Bieber",
  progress: 0.62,
};
