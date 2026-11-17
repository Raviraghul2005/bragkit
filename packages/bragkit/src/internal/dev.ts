declare const process: { env: { NODE_ENV?: string } } | undefined;

/** Warn in development only. Safe where `process` does not exist. */
export function devWarn(message: string) {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  console.warn(`[bragkit] ${message}`);
}
