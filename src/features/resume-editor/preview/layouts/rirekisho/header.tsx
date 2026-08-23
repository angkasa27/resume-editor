import { differenceInYears, isValid, parseISO } from "date-fns";
import type { ReactNode } from "react";

import { parseDayMonthYear } from "@/features/resume-editor/domain/month-year";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

// 令和8年8月23日 — the calendar a Japanese form dates itself in. Intl owns the
// era table, so the next era needs no edit here.
const JAPANESE_DATE = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
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
  return parsed ? JAPANESE_DATE.format(parsed) : (value ?? "");
}

/** "平成6年6月12日生（満32歳）". The age counts to the document's own as-of date,
 * never to today: a render must give the same page every time it runs. */
function birthLine(birthDate: string | undefined, asOf: Date) {
  const born = japaneseDate(birthDate);
  if (!born) return "";
  const parsed = parseFormDate(birthDate);
  if (!parsed || !isValid(asOf)) return `${born}生`;
  const age = differenceInYears(asOf, parsed);
  return age >= 0 ? `${born}生（満${age}歳）` : `${born}生`;
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

/** 男・女 with the answer ringed, the way the printed form is filled in. Any
 * other wording (a self-description, another language) prints as typed. */
function Gender({ value }: { value?: string }) {
  const answer = value?.trim() ?? "";
  if (answer !== "男" && answer !== "女") return <>{answer}</>;
  return (
    <>
      {["男", "女"].map((option, index) => (
        <span key={option}>
          {index > 0 ? <span className="rirekisho-gender-dot">・</span> : null}
          <span
            className={cn(
              "rirekisho-gender-option",
              option === answer && "is-answer",
            )}
          >
            {option}
          </span>
        </span>
      ))}
    </>
  );
}

export function RirekishoHeader({ context }: LayoutHeaderProps) {
  const { profile, updatedAt } = context.draft;
  // Declared by `layout-section-rules.ts` and filled in the Rirekisho details
  // panel; absent on a draft that has never been on this layout.
  const extras = profile.extras ?? {};
  const asOf = parseISO(updatedAt);

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
            <div className="rirekisho-line rirekisho-birth-line">
              <span className="rirekisho-label">生年月日</span>
              <span className="rirekisho-value">
                {birthLine(extras.birthDate, asOf)}
              </span>
              <span className="rirekisho-label rirekisho-label-inner">
                性別
              </span>
              <span className="rirekisho-value rirekisho-gender">
                <Gender value={extras.gender} />
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
          <Line label="郵便番号" className="rirekisho-line-dashed">
            {postal(extras.postalCode)}
          </Line>
          <Line
            label="現住所"
            className="rirekisho-line-dashed rirekisho-address-line"
          >
            {profile.location}
          </Line>
          <Line label="E-mail">{profile.email}</Line>
        </div>
        <div className="rirekisho-contact-side">
          <Stacked label="自宅電話" className="rirekisho-line-dashed">
            {extras.homePhone}
          </Stacked>
          <Stacked label="携帯電話">{profile.phone}</Stacked>
        </div>
      </div>

      {/* 連絡先 — filled in only when post should go somewhere other than 現住所. */}
      <div className="rirekisho-contact">
        <div className="rirekisho-contact-main">
          <Line label="ふりがな" className="rirekisho-line-dashed">
            {extras.contactAddressReading}
          </Line>
          <Line label="郵便番号" className="rirekisho-line-dashed">
            {postal(extras.contactPostalCode)}
          </Line>
          <Line label="連絡先" className="rirekisho-address-line">
            <span className="rirekisho-note">
              （現住所以外に連絡を希望する場合のみ記入）
            </span>
            {extras.contactAddress}
          </Line>
        </div>
        <div className="rirekisho-contact-side">
          <Stacked label="連絡先電話">{extras.contactPhone}</Stacked>
        </div>
      </div>
    </header>
  );
}
