import { Fragment } from "react";

/**
 * Wraps a title so lines break at spaces, never inside a hyphenated word:
 *
 *     Hammam            not      Hammam Al-
 *     Al-Hakim                   Hakim
 *
 * CSS cannot do this. A hyphen is a soft wrap opportunity in UAX#14, and
 * `word-break: keep-all` — which reads like it should suppress one — does not
 * in Chromium, which is what renders both the preview and the exported PDF.
 * So the break opportunity is removed structurally instead.
 *
 * Only hyphenated words are pinned. Leaving everything else to normal wrapping
 * keeps the emergency break available for a single long token (a German
 * compound, a URL-like title) that would otherwise overflow its column.
 * The text content is unchanged — spaces stay outside the spans — so what a
 * parser extracts from the PDF is exactly what was typed.
 */
export function WrapOnSpace({ text }: { text: string }) {
  if (!text.includes("-")) return <>{text}</>;

  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          {word.includes("-") ? (
            <span className="keep-word">{word}</span>
          ) : (
            word
          )}
        </Fragment>
      ))}
    </>
  );
}
