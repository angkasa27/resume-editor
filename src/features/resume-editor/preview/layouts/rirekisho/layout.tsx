import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  LayoutComponentProps,
  LayoutSlots,
  PreviewLayoutDefinition,
} from "@/features/resume-editor/preview/layout-types";

import { RirekishoHeader } from "./header";
import { rirekishoItemViews } from "./items";
import styles from "./styles.module.css";

/** The form files sections into fixed regions, so the layout looks them up by
 * key rather than printing them in the sidebar's order. Within the history
 * table 学歴 precedes 職歴, which is the form's own order, not the user's. */
const HISTORY_KEYS = [
  "education",
  "workExperience",
  "organizationVolunteering",
] as const;
const LICENCE_KEYS = ["certifications", "languages"] as const;
const PROSE_KEYS = ["skills"] as const;

const PLACED_KEYS = new Set<CollectionSectionKey>([
  ...HISTORY_KEYS,
  ...LICENCE_KEYS,
  ...PROSE_KEYS,
]);

/** A section's own heading only shows where the form has no printed caption for
 * it: 学歴 and 職歴 label their runs inside the history table, and a section the
 * form never anticipated gets a table of its own. The rest are captioned by the
 * region they sit in, and hide their heading in CSS. */
function renderSectionHeading(
  sectionKey: CollectionSectionKey | "summary",
  heading: ReactNode,
): ReactNode {
  if (PLACED_KEYS.has(sectionKey as CollectionSectionKey)) return heading;
  return (
    <>
      <span className="rirekisho-year">年</span>
      <span className="rirekisho-month">月</span>
      <span className="rirekisho-cell">{heading}</span>
    </>
  );
}

/** A ruled table: the 年 / 月 caption row, then rows on the shared line grid. */
function Table({
  caption,
  closing = false,
  children,
}: {
  caption: string;
  closing?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rirekisho-table">
      <div className="rirekisho-row rirekisho-caption-row">
        <span className="rirekisho-year">年</span>
        <span className="rirekisho-month">月</span>
        <span className="rirekisho-cell">{caption}</span>
      </div>
      <div className="rirekisho-rows">
        {children}
        {/* The history table closes with 以上, as the form requires. */}
        {closing ? (
          <div className="rirekisho-row rirekisho-close">
            <span className="rirekisho-year" />
            <span className="rirekisho-month" />
            <span className="rirekisho-cell">以上</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SmallBox({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="rirekisho-small-box">
      <span className="rirekisho-caption">{label}</span>
      <span className="rirekisho-small-value">{children}</span>
    </div>
  );
}

function RirekishoLayout({ context, slots }: LayoutComponentProps) {
  const extras = context.draft.profile.extras ?? {};
  const byKey = new Map(slots.sections.map((entry) => [entry.key, entry]));
  const pick = (keys: ReadonlyArray<CollectionSectionKey>) =>
    keys.map((key) => byKey.get(key)).filter(Boolean) as LayoutSlots["sections"];

  const history = pick(HISTORY_KEYS);
  const licences = pick(LICENCE_KEYS);
  const prose = pick(PROSE_KEYS);
  // A section the form never anticipated still prints, in a table of its own.
  const unplaced = slots.sections.filter((entry) => !PLACED_KEYS.has(entry.key));

  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}

      {history.length > 0 ? (
        <Table caption="学歴・職歴（各別にまとめて書く）" closing>
          {history.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </Table>
      ) : null}

      {licences.length > 0 ? (
        <Table caption="免許・資格">
          {licences.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </Table>
      ) : null}

      {unplaced.map(({ key, node }) => (
        <div key={key} className="rirekisho-table">
          <div className="rirekisho-rows">{node}</div>
        </div>
      ))}

      {/* Both boxes move whole: the paginator would otherwise shift the prose
          inside them past a page break and leave the caption behind. */}
      <div className="rirekisho-band" data-page-unit="">
        <div className="rirekisho-band-main">
          <span className="rirekisho-caption">
            志望動機、特技、自己PRなど
          </span>
          {slots.summary}
          {prose.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
        <div className="rirekisho-band-side">
          <SmallBox label="通勤時間">{extras.commuteTime}</SmallBox>
          <SmallBox label="扶養家族（配偶者を除く）">
            {extras.dependents ? `${extras.dependents} 人` : null}
          </SmallBox>
          <div className="rirekisho-band-pair">
            <SmallBox label="配偶者">{extras.spouse}</SmallBox>
            <SmallBox label="配偶者の扶養義務">{extras.spouseSupport}</SmallBox>
          </div>
        </div>
      </div>

      <div className="rirekisho-requests" data-page-unit="">
        <span className="rirekisho-caption">
          本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）
        </span>
        <span className="rirekisho-requests-body">{extras.requests}</span>
      </div>
    </div>
  );
}

export const rirekishoLayout: PreviewLayoutDefinition = {
  id: "rirekisho",
  label: "Rirekisho",
  description:
    "The Japanese 履歴書 form, ruled like the printed sheet: identity block with a photo box, history in 年 / 月 columns, then the 志望動機 and 本人希望 boxes.",
  // The 志望動機 box prints its own caption over the summary.
  hideSummaryHeading: true,
  Component: RirekishoLayout,
  Header: RirekishoHeader,
  itemViews: rirekishoItemViews,
  renderSectionHeading,
};
