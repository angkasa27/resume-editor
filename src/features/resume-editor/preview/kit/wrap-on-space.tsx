import { Fragment } from "react";

/**
 * Wraps a title so lines break at spaces, never inside a hyphenated word. CSS
 * can't do this: a hyphen is a UAX#14 break opportunity and Chromium keeps
 * breaking there under `word-break: keep-all`. The hyphen is pinned to the next
 * character (not the whole word, which would swallow `overflow-wrap`), and the
 * text content is unchanged.
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