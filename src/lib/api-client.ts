/** The server's error message for a failed response, or `fallback` if it didn't
 *  send one (or didn't answer with JSON at all). */
export async function responseErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const payload = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;
  return payload?.message || fallback;
}

/**
 * POSTs a JSON body and returns the parsed payload, throwing the server's
 * `message` (or `fallback`) on failure. Fields are optional because a failed
 * route answers with `{ message }` alone — callers check the one they need.
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
