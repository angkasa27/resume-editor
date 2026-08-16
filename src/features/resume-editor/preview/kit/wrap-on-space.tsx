import { Fragment } from "react";

/**
 * Wraps a title so lines break at spaces, never inside a hyphenated word:
 *
 *     Maya               not      Maya Dela-
 *     Dela-Cruz                   Cruz
 *
 * CSS cannot do this. A hyphen is a soft wrap opportunity in UAX#14, and
 * `word-break: keep-all` — which reads like it should suppress one — does not
 * in Chromium, which is what renders both the preview and the exported PDF.
 * So the break opportunity is removed structurally instead.
 *
 * The hyphen is pinned to the character after it (`-C` in `Dela-Cruz`) rather
 * than the whole word. Pin the whole word and there is no escape hatch:
 * `white-space: nowrap` also swallows `overflow-wrap`, so a hyphenated German
 * compound or URL-like title longer than its column overflows instead of
 * breaking. With only the hyphen run pinned, the halves stay together in
 * normal wrapping yet each can still take the emergency break — the container's
 * own `overflow-wrap` — when the word alone cannot fit.
 *
 * The text content is unchanged — the spans only add markup around the same
 * characters — so what a parser extracts from the PDF is exactly what was
 * typed.
 */
function HyphenatedWord({ word }: { word: string }) {
  const segments = word.split("-");
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <span className="keep-word">-{segment.charAt(0)}</span>
          ) : null}
          {segment.slice(index > 0 ? 1 : 0)}
        </Fragment>
      ))}
    </>
  );
}

export function WrapOnSpace({ text }: { text: string }) {
  if (!text.includes("-")) return <>{text}</>;

  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          {word.includes("-") ? <HyphenatedWord word={word} /> : word}
        </Fragment>
      ))}
    </>
  );
}