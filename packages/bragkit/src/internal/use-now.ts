import { useEffect, useState } from "react";

/**
 * The current time, refreshed at the start of every minute. It is `null` during server
 * rendering and the first client render, so the server HTML and the hydrated HTML match;
 * widgets show a same-size placeholder until then.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = setTimeout(tick, 60_000 - (date.getTime() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return now;
}
