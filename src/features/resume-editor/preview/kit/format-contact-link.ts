import type { PreviewContactItem } from "../types";

// Shrinks only the visible text (the href keeps the full URL): a raw URL costs a
// whole line and wraps mid-word in a rail.
export function formatContactLink(url: string): string {
  const withoutProtocol = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const withoutWww = withoutProtocol.replace(/^www\./i, "");
  const withoutTrailingSlash = withoutWww.replace(/\/+$/, "");
  return withoutTrailingSlash || url;
}

// null keeps the field as plain text, which is what a half-typed address needs.
export function contactHref(item: PreviewContactItem): string | null {
  switch (item.kind) {
    case "link":
      return item.value;
    case "email": {
      // Needs a domain, not just an "@" — `michael@` would be a dead mailto:.
      const address = item.value.trim();
      return /^\S+@\S+\.\S+$/.test(address) ? `mailto:${address}` : null;
    }
    case "phone": {
      // The href needs digits only; the visible text keeps its formatting.
      const dialable = item.value.replace(/[^\d+]/g, "");
      return /\d/.test(dialable) ? `tel:${dialable}` : null;
    }
    default:
      return null;
  }
}
