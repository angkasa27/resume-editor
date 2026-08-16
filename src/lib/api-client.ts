/**
 * POSTs JSON and returns the parsed payload, throwing the server's `message`
 * (or `fallback`) on failure. Fields are optional — failed routes answer with
 * `{ message }` alone.
 */
export async function postJson<T extends object>(
  url: string,
  body: unknown,
  fallback: string,
): Promise<Partial<T> & { message?: string }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as Partial<T> & {
    message?: string;
  };
  if (!response.ok) throw new Error(payload.message || fallback);
  return payload;
}
