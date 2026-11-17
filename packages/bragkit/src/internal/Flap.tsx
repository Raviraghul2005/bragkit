/** One cell of a split-flap board. The character flips in again every time it changes. */
export function Flap({ char }: { char: string }) {
  return (
    <span className="bk-flap" aria-hidden="true">
      <span className="bk-flap-char" key={char}>
        {char === " " ? " " : char}
      </span>
    </span>
  );
}
