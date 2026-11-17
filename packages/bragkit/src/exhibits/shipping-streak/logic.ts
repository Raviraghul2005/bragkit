import { addDays, toDayKey, type DayInput } from "../../internal/days";

/** The set of days with at least one ship, as "YYYY-MM-DD" keys in `zone`. */
export function shippedDays(dates: readonly DayInput[], zone?: string): Set<string> {
  const days = new Set<string>();
  for (const d of dates) {
    const key = toDayKey(d, zone);
    if (key) days.add(key);
  }
  return days;
}

/**
 * Consecutive shipped days ending today. A streak that ended yesterday still counts until
 * today is over, so nobody loses their streak at breakfast.
 */
export function countStreak(days: ReadonlySet<string>, today: string): number {
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** The last `n` days, oldest first, ending today. */
export function lastDays(today: string, n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) out.push(addDays(today, -i));
  return out;
}

interface GitHubEvent {
  type?: string;
  created_at?: string;
}

// Pushes, plus new repositories, branches and tags: a brand-new repo's first push is
// reported as a CreateEvent, not a PushEvent.
const SHIP_EVENTS = new Set(["PushEvent", "CreateEvent"]);

/** Ship dates from GitHub's public events feed (covers about the last 90 days). */
export function pushDates(events: readonly GitHubEvent[]): string[] {
  return events
    .filter((e) => SHIP_EVENTS.has(e.type ?? "") && typeof e.created_at === "string")
    .map((e) => e.created_at as string);
}

const cache = new Map<string, Promise<string[]>>();

/**
 * Fetches a user's public push dates, three pages of 100 events at most. Requests are shared
 * between widgets for the same user, and a failed request can be retried on the next mount.
 */
export function fetchGitHubPushDates(user: string): Promise<string[]> {
  const key = user.toLowerCase();
  let pending = cache.get(key);
  if (!pending) {
    const base = `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100&page=`;
    pending = Promise.all(
      [1, 2, 3].map(async (page) => {
        const res = await fetch(base + page, { headers: { Accept: "application/vnd.github+json" } });
        // GitHub answers 422 once you page past the events it keeps; that just means "no more".
        if (res.status === 422) return [];
        if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
        return pushDates((await res.json()) as GitHubEvent[]);
      }),
    ).then((pages) => pages.flat());
    pending.catch(() => cache.delete(key));
    cache.set(key, pending);
  }
  return pending;
}
