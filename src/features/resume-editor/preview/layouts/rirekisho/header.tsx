import { isValid, parseISO } from "date-fns";
import type { ReactNode } from "react";

import { parseDayMonthYear } from "@/features/resume-editor/domain/month-year";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

// The sheet spaces and pads its dates: 令和 8 年 08 月 23 日. `Intl` owns the era
// table, so the next era needs no edit here.
const JAPANESE_ERA_YEAR = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long",
  year: "numeric",
});

/** The date field stores what its picker writes — "12 Jun 1994" — while
 * `updatedAt` and any draft written before that picker existed are ISO. Both
 * parse; anything else prints as typed. */
function parseFormDate(value: string | undefined) {
  if (!value) return undefined;
  const dayMonthYear = parseDayMonthYear(value);
  if (dayMonthYear) return dayMonthYear;
  const iso = parseISO(value);
  return isValid(iso) ? iso : undefined;
}

function japaneseDate(value: string | undefined) {
  const parsed = parseFormDate(value);
  if (!parsed) return value ?? "";

  const parts = JAPANESE_ERA_YEAR.formatToParts(parsed);
  const era = parts.find((part) => part.type === "era")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${era} ${year} 年 ${month} 月 ${day} 日`;
}

const postal = (value: string | undefined) => (value ? `〒${value}` : "");

/** One ruled line of the identity block: a label cell, then its value. */
function Line({
  label,
  children,
  className,
}: {
  label: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rirekisho-line", className)}>
      <span className="rirekisho-label">{label}</span>
      <span className="rirekisho-value">{children}</span>
    </div>
  );
}

/** The right-hand contact stack: a small caption over its value, as the form
 * prints 電話 and メールアドレス. */
function Stacked({
  label,
  children,
  className,
}: {
  label: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rirekisho-stack", className)}>
      <span className="rirekisho-caption">{label}</span>
      <span className="rirekisho-value">{children}</span>
    </div>
  );
}

export function RirekishoHeader({ context }: LayoutHeaderProps) {
  const { profile, updatedAt } = context.draft;
  // Declared by `layout-section-rules.ts` and filled in the Rirekisho details
  // panel; absent on a draft that has never been on this layout.
  const extras = profile.extras ?? {};

  return (
    <header className={`${styles.header} layout-header`} data-layout="rirekisho">
      {/* The photo hangs from the very top of the sheet, so the title and the
          as-of date sit beside it rather than above it. */}
      <div className="rirekisho-head">
        <div className="rirekisho-head-main">
          <div className="rirekisho-title">
            <span className="rirekisho-title-text">履歴書</span>
            <span className="rirekisho-title-date">
              {japaneseDate(updatedAt)}現在
            </span>
          </div>

          <div className="rirekisho-identity-main">
            <Line label="ふりがな" className="rirekisho-line-dashed">
              {extras.nameReading}
            </Line>
            <Line label="氏 名" className="rirekisho-name-line">
              <h1 className="name" data-testid="resume-preview-full-name">
                <WrapOnSpace text={profile.fullName} />
              </h1>
            </Line>
            {/* The sheet prints the birth date and the answered 性別 — no age,
                and no unanswered option. */}
            <div className="rirekisho-line rirekisho-birth-line">
              <span className="rirekisho-value">
                {extras.birthDate ? `${japaneseDate(extras.birthDate)}生` : ""}
              </span>
              <span className="rirekisho-value rirekisho-gender">
                {extras.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Part of the form whether or not a photo was uploaded: empty, it is
            the printed sheet's dashed placeholder and carries its instructions;
            filled, the photo is simply pasted on, with no frame. */}
        <div
          className="rirekisho-photo"
          data-slot="photo-frame"
          data-empty={profile.photo ? undefined : ""}
        >
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photo} alt={profile.fullName} />
          ) : (
            <span className="rirekisho-photo-hint">
              写真をはる位置
              <br />
              1. 縦36〜40mm
              <br />
              　 横24〜30mm
              <br />
              2. 本人単身胸から上
              <br />
              3. 裏面のりづけ
            </span>
          )}
        </div>
      </div>

      {/* 現住所: kana, postal code, address and e-mail down the left; the two
          phone numbers the form asks for down the right. */}
      <div className="rirekisho-contact">
        <div className="rirekisho-contact-main">
          <Line label="ふりがな" className="rirekisho-line-dashed">
            {extras.addressReading}
          </Line>
          <Line
            label="現 住 所"
            className="rirekisho-line-dashed rirekisho-address-line"
          >
            {postal(extras.postalCode)}
            <span className="rirekisho-address-body">{profile.location}</span>
          </Line>
          <Line label="E-mail">{profile.email}</Line>
        </div>
        <div className="rirekisho-contact-side">
          <Stacked label="（自宅電話）" className="rirekisho-line-dashed">
            {extras.homePhone}
          </Stacked>
          <Stacked label="（携帯電話）">{profile.phone}</Stacked>
        </div>
      </div>

      {/* 連絡先 — filled in only when post should go somewhere other than 現住所. */}
      <div className="rirekisho-contact">
        <div className="rirekisho-contact-main">
          <Line label="ふりがな" className="rirekisho-line-dashed">
            {extras.contactAddressReading}
          </Line>
          <Line label="連 絡 先" className="rirekisho-address-line">
            {postal(extras.contactPostalCode)}
            <span className="rirekisho-note">
              （現住所以外に連絡を希望する場合のみ記入）
            </span>
            <span className="rirekisho-address-body">
              {extras.contactAddress}
            </span>
          </Line>
        </div>
        <div className="rirekisho-contact-side">
          <Stacked label="（連絡先電話）">{extras.contactPhone}</Stacked>
        </div>
      </div>
    </header>
  );
}
