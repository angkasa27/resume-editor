import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

type ParsedBody<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

/** Parse a JSON body into a discriminated result, so callers share the parse/guard but keep their own 400 message. */
export async function parseJsonBody<T = unknown>(
  request: Request,
  invalidMessage = "Invalid request body.",
): Promise<ParsedBody<T>> {
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
