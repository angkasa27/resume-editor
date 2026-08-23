import { differenceInYears, format, isValid, parseISO } from "date-fns";

import { formatContactLink, contactHref } from "@/features/resume-editor/preview/kit/format-contact-link";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { compactJoin } from "@/features/resume-editor/preview/helpers/string";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

/** "1990年4月2日生（満36歳）". The age counts to the document's own as-of date,
 * not to today: a render must give the same page every time it runs. */
function birthLine(birthDate: string | undefined, asOf: Date) {
  if (!birthDate) return "";
  const parsed = parseISO(birthDate);
  if (!isValid(parsed)) return birthDate;
  const age = differenceInYears(asOf, parsed);
  const born = format(parsed, "yyyy年M月d日");
  return age >= 0 ? `${born}生（満${age}歳）` : `${born}生`;
}

function LabelledRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rirekisho-field", className)}>
      <span className="rirekisho-field-label">{label}</span>
      <span className="rirekisho-field-value">{children}</span>
    </div>
  );
}

export function RirekishoHeader({ context }: LayoutHeaderProps) {
  const { profile, updatedAt } = context.draft;
  // Declared by `layout-section-rules.ts` and filled in the Rirekisho details
  // panel; absent on a draft that has never been on this layout.
  const extras = profile.extras ?? {};
  const asOf = parseISO(updatedAt);
  const asOfLabel = isValid(asOf) ? format(asOf, "yyyy年M月d日現在") : "";
  const address = compactJoin([
    extras.postalCode ? `〒${extras.postalCode}` : "",
    profile.location,
  ]);

  return (
    <header className={`${styles.header} layout-header`} data-layout="rirekisho">
      <div className="rirekisho-title">
        <span className="rirekisho-title-text">履歴書</span>
        <span className="rirekisho-title-date">{asOfLabel}</span>
      </div>

      <div className="rirekisho-identity">
        <div className="rirekisho-identity-fields">
          <LabelledRow label="ふりがな">{extras.nameReading}</LabelledRow>
          <LabelledRow label="氏名" className="rirekisho-name-field">
            <h1 className="name" data-testid="resume-preview-full-name">
              <WrapOnSpace text={profile.fullName} />
            </h1>
          </LabelledRow>
          <div className="rirekisho-birth">
            <LabelledRow label="生年月日">
              {birthLine(extras.birthDate, asOf)}
            </LabelledRow>
            <LabelledRow label="性別" className="rirekisho-gender">
              {extras.gender}
            </LabelledRow>
          </div>
          {profile.headline ? (
            <LabelledRow label="職種">
              <span className="headline">{profile.headline}</span>
            </LabelledRow>
          ) : null}
        </div>

        {/* The 30×40mm photo box is part of the form, so it is drawn whether or
            not a photo was uploaded. */}
        <div className="rirekisho-photo" data-slot="photo-frame">
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photo} alt={profile.fullName} />
          ) : (
            <span className="rirekisho-photo-hint">写真</span>
          )}
        </div>
      </div>

      <div className="rirekisho-contact">
        <LabelledRow label="ふりがな">{extras.addressReading}</LabelledRow>
        <LabelledRow label="現住所">{address}</LabelledRow>
        <LabelledRow label="電話">{profile.phone}</LabelledRow>
        <LabelledRow label="メール">{profile.email}</LabelledRow>
        {context.contactItems
          .filter((item) => item.kind === "link")
          .map((item, index) => (
            <LabelledRow
              key={`${item.value}-${index}`}
              label={index === 0 ? "URL" : ""}
            >
              <a
                href={contactHref(item) ?? item.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatContactLink(item.value)}
              </a>
            </LabelledRow>
          ))}
      </div>
    </header>
  );
}
