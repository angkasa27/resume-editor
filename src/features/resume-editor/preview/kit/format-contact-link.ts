// Shrinks only the visible text (the href keeps the full URL): a raw URL costs a
// whole line and wraps mid-word in a rail.
export function formatContactLink(url: string): string {
  const withoutProtocol = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const withoutWww = withoutProtocol.replace(/^www\./i, "");
  const withoutTrailingSlash = withoutWww.replace(/\/+$/, "");
  return withoutTrailingSlash || url;
}
