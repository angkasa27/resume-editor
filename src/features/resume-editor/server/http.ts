import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

type ParsedBody<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

// Route handlers stream the body with no size limit of their own, so every
// field cap downstream is applied to something already held in memory. The
// largest legitimate body is a draft with an embedded profile photo, which the
// client re-encodes to roughly 100KB.
const MAX_BODY_BYTES = 2 * 1024 * 1024;

/** Parse a JSON body into a discriminated result, so callers share the parse/guard but keep their own 400 message. */
export async function parseJsonBody<T = unknown>(
  request: Request,
  invalidMessage = "Invalid request body.",
): Promise<ParsedBody<T>> {
  const declaredLength = Number(request.headers.get("content-length"));

  // ponytail: trusts a declared Content-Length, so a chunked upload still
  // streams unbounded. Count bytes off the body stream if that becomes real.
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: Response.json(
        { message: "Request body is too large." },
        { status: 413 },
      ),
    };
  }

  try {
    return { ok: true, data: (await request.json()) as T };
  } catch {
    return {
      ok: false,
      response: Response.json({ message: invalidMessage }, { status: 400 }),
    };
  }
}

/** Map a caught error to a JSON Response: `ResumeImportError` keeps its message + status, anything else is a generic 500. */
export function handleResumeImportError(
  error: unknown,
  fallbackMessage: string,
): Response {
  if (error instanceof ResumeImportError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  // Anything that isn't a ResumeImportError is unexpected, and the client only
  // ever sees the generic fallback — without this the cause leaves no trace.
  console.error(fallbackMessage, error);
  return Response.json({ message: fallbackMessage }, { status: 500 });
}
