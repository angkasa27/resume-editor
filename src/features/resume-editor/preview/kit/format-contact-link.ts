// Shrinks only the visible text (href/accessible name keep the full URL): a raw URL costs a
// whole line and wraps mid-word in a rail, while ATS parsers match the shortened text just as well.
export function formatContactLink(url: string): string {
  const withoutProtocol = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const withoutWww = withoutProtocol.replace(/^www\./i, "");
  const withoutTrailingSlash = withoutWww.replace(/\/+$/, "");
  return withoutTrailingSlash || url;
}
