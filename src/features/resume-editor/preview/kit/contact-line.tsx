import { Link, Mail, MapPin, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { shouldOpenHrefInNewTab } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

import { contactHref, formatContactLink } from "./format-contact-link";
import type { PreviewContactItem, PreviewRenderContext } from "../types";

/** `stacked` is the only variant that reads in a narrow rail. Icons are opt-in
 * (they clash with typographic layouts); `labeled` stacks and names each field. */
type ContactVariant = "inline" | "stacked" | "labeled";

export type ContactPresentation = {
  variant: ContactVariant;
  icons: boolean;
};

const DEFAULT_CONTACT_PRESENTATION: ContactPresentation = {
  variant: "inline",
  icons: true,
};

// One glyph per link kind: lucide dropped brand icons, and the shortened text
// names the brand better than a generic icon would.
const ICON_BY_KIND = {
  location: MapPin,
  phone: Phone,
  email: Mail,
  link: Link,
} as const;

const LABEL_BY_KIND: Record<PreviewContactItem["kind"], string> = {
  location: "Location",
  phone: "Phone",
  email: "Email",
  link: "Link",
};

export function PreviewContactLine({
  context,
  className,
  presentation = DEFAULT_CONTACT_PRESENTATION,
  only,
  exclude,
}: {
  context: PreviewRenderContext;
  className?: string;
  presentation?: ContactPresentation;
  /** Splits the block so a layout can head the two halves separately ("Details" / "Links"). */
  only?: "details" | "links";
  /** Drops one field, for a layout that sets it somewhere else on the page. */
  exclude?: PreviewContactItem["kind"];
}) {
  const labeled = presentation.variant === "labeled";
  const contactItems = exclude
    ? context.contactItems.filter((item) => item.kind !== exclude)
    : context.contactItems;
  const details =
    only === "links" ? [] : contactItems.filter((item) => item.kind !== "link");
  const links =
    only === "details"
      ? []
      : contactItems.filter((item) => item.kind === "link");

  const listClass = cn(
    "contact-line",
    (presentation.variant === "stacked" || labeled) && "contact-line-stacked",
    labeled && "contact-line-labeled",
    presentation.icons && "contact-line-iconic",
    className,
  );

  return (
    <div className="contact-block">
      {details.length > 0 ? (
        <ul className={listClass}>
          {details.map((item, index) => (
            <li
              key={`${item.kind}-${item.value}-${index}`}
              className="contact-item"
            >
              {labeled ? (
                <span className="contact-label">{LABEL_BY_KIND[item.kind]}</span>
              ) : null}
              <PreviewContactItemText item={item} icons={presentation.icons} />
            </li>
          ))}
        </ul>
      ) : null}
      {links.length > 0 ? (
        <ul className={cn(listClass, "contact-links")}>
          {links.map((item, index) => (
            <li
              key={`${item.kind}-${item.value}-${index}`}
              className="contact-item"
            >
              <PreviewContactItemText item={item} icons={presentation.icons} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PreviewContactItemText({
  item,
  icons,
}: {
  item: PreviewContactItem;
  icons: boolean;
}) {
  // The accessible name keeps the full URL; only the visible text shortens.
  const label = `${LABEL_BY_KIND[item.kind]}: ${item.value}`;
  const Icon = ICON_BY_KIND[item.kind];
  const icon = icons ? (
    <Icon className="contact-icon" aria-hidden={true} />
  ) : null;

  const text =
    item.kind === "link" ? formatContactLink(item.value) : item.value;
  // mailto:/tel: make the exported PDF's contacts dialable; only http links
  // leave the document, so only they take a target.
  const href = contactHref(item);

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        target={shouldOpenHrefInNewTab(href) ? "_blank" : undefined}
        rel={shouldOpenHrefInNewTab(href) ? "noopener noreferrer" : undefined}
      >
        {icon}
        <span>{text}</span>
      </a>
    );
  }

  // No aria-label: it is ignored on a role-less span, so the text has to carry
  // itself. Only the anchor branch above can name itself.
  return (
    <span>
      {icon}
      {text}
    </span>
  );
}
