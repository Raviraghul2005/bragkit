"use client";

import { useState } from "react";
import { BrassPlate } from "bragkit";
import { ExhibitView } from "./exhibit-view";
import { codeFor, startValues, type ExhibitMeta, type PropSpec, type Values } from "@/lib/exhibits";
import { site } from "@/lib/site";

const TONES = ["apricot", "lilac", "mint", "rose", "cobalt", "plain"] as const;
type Size = "sm" | "md" | "lg";

function Segment<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<[T, string]>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="xp-seg" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={v === value} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}

function JsonControl({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [bad, setBad] = useState(false);
  return (
    <>
      <textarea
        className="xp-json"
        value={text}
        rows={Math.min(12, Math.max(3, text.split("\n").length))}
        spellCheck={false}
        aria-invalid={bad}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setBad(false);
          } catch {
            setBad(true);
          }
        }}
      />
      {bad ? <span className="xp-hint">Not valid JSON yet. The exhibit keeps the last good value.</span> : null}
    </>
  );
}

function Control({
  name,
  spec,
  value,
  onChange,
}: {
  name: string;
  spec: PropSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (spec.type === "function") return null;

  if (spec.type === "boolean") {
    return (
      <label className="xp-field xp-switch">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span className="mono">{name}</span>
      </label>
    );
  }

  if (spec.type === "tone") {
    return (
      <div className="xp-field" role="group" aria-label={name}>
        <span className="mono">
          {name}
          <b>{String(value ?? "")}</b>
        </span>
        <div className="xp-tones">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              className={`xp-tone xp-tone-${t}`}
              aria-label={t}
              aria-pressed={value === t}
              onClick={() => onChange(t)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <label className={spec.type === "json" ? "xp-field xp-wide" : "xp-field"}>
      <span className="mono">
        {name}
        {spec.type === "number" ? <b>{String(value ?? "")}</b> : null}
      </span>
      {spec.type === "string" ? (
        <input
          type="text"
          value={String(value ?? "")}
          placeholder={spec.placeholder ?? spec.default}
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : spec.type === "number" ? (
        <input
          type="range"
          min={spec.min}
          max={spec.max}
          step={spec.step ?? 1}
          value={Number(value ?? spec.min)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : spec.type === "enum" ? (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {spec.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <JsonControl value={value} onChange={onChange} />
      )}
    </label>
  );
}

/** The room for one exhibit: a live preview, a props panel built from its meta, and the code. */
export function ExhibitRoom({ meta }: { meta: ExhibitMeta }) {
  const [values, setValues] = useState<Values>(() => startValues(meta));
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [size, setSize] = useState<Size>("md");
  const [copied, setCopied] = useState(false);
  // Remounting replays entrances (flips, count-ups, signatures).
  const [run, setRun] = useState(0);

  const code = codeFor(meta, values, { size });
  const props = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== "" && v !== undefined));

  const copy = () => {
    try {
      navigator.clipboard?.writeText(code).catch(() => {});
    } catch {
      // The clipboard can be blocked; the code stays readable.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="xp-room">
      <div className="xp-stage" data-theme={theme}>
        <div className="xp-tools">
          <Segment
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              ["light", "Light"],
              ["dark", "Dark"],
            ]}
          />
          <Segment
            label="Size"
            value={size}
            onChange={setSize}
            options={[
              ["sm", "S"],
              ["md", "M"],
              ["lg", "L"],
            ]}
          />
          <button type="button" className="xp-replay" onClick={() => setRun((n) => n + 1)}>
            Replay
          </button>
        </div>
        <div className="xp-floor">
          <div className="xp-object" key={run}>
            <ExhibitView slug={meta.slug} props={props} size={size} />
          </div>
        </div>
      </div>

      <div className="xp-panel">
        <form className="xp-form" onSubmit={(e) => e.preventDefault()} aria-label={`${meta.name} props`}>
          {Object.entries(meta.props).map(([name, spec]) => (
            <Control
              key={name}
              name={name}
              spec={spec}
              value={values[name]}
              onChange={(v) => setValues((prev) => ({ ...prev, [name]: v }))}
            />
          ))}
        </form>
        <div className="xp-code">
          <pre className="code-light">{code}</pre>
          <button className="btn btn-p btn-s" type="button" onClick={copy}>
            <span aria-live="polite">{copied ? "Copied" : "Copy code"}</span>
          </button>
        </div>
        <div className="xp-install">
          <BrassPlate copy={site.install} />
          <pre className="code-light">{`import "bragkit/styles.css" // once, anywhere`}</pre>
        </div>
      </div>
    </div>
  );
}
