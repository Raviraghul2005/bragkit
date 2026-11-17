"use client";

import type { ComponentType } from "react";
import * as bragkit from "bragkit";
import { bySlug, type Values } from "@/lib/exhibits";

type Any = ComponentType<Record<string, unknown>>;
const noop = () => {};

/** Renders an exhibit from the registry by its slug, with its example props unless told otherwise. */
export function ExhibitView({
  slug,
  props,
  size,
  theme,
}: {
  slug: string;
  /** Replaces the example props. */
  props?: Values;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark" | "auto";
}) {
  const meta = bySlug(slug);
  if (!meta) return null;
  const Exhibit = (bragkit as unknown as Record<string, Any>)[meta.component];
  if (!Exhibit) return null;
  // Callbacks cannot live in the registry. On the site they do nothing, which is enough to show
  // the parts that need them (the signing form in the Visitors' Book). Nothing is saved.
  const handlers = Object.fromEntries(
    Object.entries(meta.props)
      .filter(([, spec]) => spec.type === "function")
      .map(([name]) => [name, noop]),
  );
  return <Exhibit {...handlers} {...(props ?? meta.example)} size={size} theme={theme} />;
}
