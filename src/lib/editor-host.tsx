import { ResumeEditor } from "@/features/resume-editor/editor/resume-editor";

export type EditorHostProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

/**
 * Swap point for how the editor route resolves its draft source. OSS default
 * renders the local editor and ignores `searchParams`; the SaaS branch
 * **replaces this file** with a cloud-aware host, keeping the editor core and
 * route pages identical across branches. `searchParams` stays in the signature
 * so that swap can read `?id=<resumeId>` without touching the routes.
 */
export async function EditorHost({ searchParams }: EditorHostProps) {
  void searchParams;
  return <ResumeEditor />;
}
