import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/** Two fields reading as one sentence on the title line — bold, comma, italic.
 * The canonical item view stacks the second field under the first and costs a
 * line on every entry. Which field leads is the layout's call: marquee puts the
 * role first, meridian the employer. Style `.item-subject` per layout. */
export function TitleWithSubject({
  title,
  subject,
}: {
  title: string;
  subject?: string;
}) {
  return (
    <h3 className="item-title">
      <WrapOnSpace text={subject ? `${title},` : title} />
      {subject ? (
        <>
          {" "}
          <span className="item-subject">
            <WrapOnSpace text={subject} />
          </span>
        </>
      ) : null}
    </h3>
  );
}
