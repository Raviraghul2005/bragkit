// Every exhibit in the collection, in catalogue order. The website builds /exhibits from this list:
// add an exhibit here (and to index.ts and styles.css) and it appears on the site.
import type { ExhibitMeta } from "./internal/meta";
import { meta as nowPlaying } from "./exhibits/now-playing/meta";
import { meta as shippingStreak } from "./exhibits/shipping-streak/meta";
import { meta as localTime } from "./exhibits/local-time/meta";
import { meta as statusCard } from "./exhibits/status-card/meta";
import { meta as techStack } from "./exhibits/tech-stack/meta";
import { meta as openForWork } from "./exhibits/open-for-work/meta";
import { meta as contributionTapestry } from "./exhibits/contribution-tapestry/meta";
import { meta as trophyCase } from "./exhibits/trophy-case/meta";
import { meta as statsPlaque } from "./exhibits/stats-plaque/meta";
import { meta as callingCards } from "./exhibits/calling-cards/meta";
import { meta as signature } from "./exhibits/signature/meta";
import { meta as visitorsBook } from "./exhibits/visitors-book/meta";
import { meta as headCount } from "./exhibits/head-count/meta";
import { meta as daysSince } from "./exhibits/days-since/meta";
import { meta as postcard } from "./exhibits/postcard/meta";
import { meta as pinnedRepo } from "./exhibits/pinned-repo/meta";
import { meta as shipLog } from "./exhibits/ship-log/meta";
import { meta as codingToday } from "./exhibits/coding-today/meta";
import { meta as currentlyReading } from "./exhibits/currently-reading/meta";
import { meta as polaroidStack } from "./exhibits/polaroid-stack/meta";
import { meta as deskSetup } from "./exhibits/desk-setup/meta";
// @imports-end

export type { ExhibitMeta, PropSpec, Wing } from "./internal/meta";

const all: ExhibitMeta[] = [
  nowPlaying,
  shippingStreak,
  localTime,
  statusCard,
  techStack,
  openForWork,
  contributionTapestry,
  trophyCase,
  statsPlaque,
  callingCards,
  signature,
  visitorsBook,
  headCount,
  daysSince,
  postcard,
  pinnedRepo,
  shipLog,
  codingToday,
  currentlyReading,
  polaroidStack,
  deskSetup,
  // @list-end
];

export const registry: readonly ExhibitMeta[] = all.sort((a, b) => a.number.localeCompare(b.number));

export const wings = [
  { name: "East", title: "East Wing", about: "What you are doing" },
  { name: "West", title: "West Wing", about: "What you have done" },
  { name: "North", title: "North Wing", about: "Who you are" },
  { name: "South", title: "South Wing", about: "Your visitors" },
] as const;
