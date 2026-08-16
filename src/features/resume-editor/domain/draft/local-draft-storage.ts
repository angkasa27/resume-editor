import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  RESUME_STORAGE_KEY,
  exportResumeDraft,
  importResumeDraft,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";
import { parseResumeDraft } from "@/features/resume-editor/domain/schema";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

function warn(message: string, error: unknown) {
  console.warn(
    message,
    error instanceof Error ? error.message : "Unknown error",
  );
}

export class LocalDraftStorage {
  private status: SaveStatus = "idle";
  private readonly listeners = new Set<(status: SaveStatus) => void>();

  private setStatus(status: SaveStatus) {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.listeners) listener(status);
  }

  getSaveStatus(): SaveStatus {
    return this.status;
  }

  subscribeSaveStatus(listener: (status: SaveStatus) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  save(draft: ResumeDraft): ResumeDraft {
    // Lenient schema rejects only structural breakage (a section emptied to zero items).
    // Status is set first, but it must still throw: callers mark persisted only once this returns.
    let validatedDraft: ResumeDraft;
    try {
      validatedDraft = parseResumeDraft(draft);
    } catch (error) {
      warn("Refusing to persist an invalid resume draft:", error);
      this.setStatus("error");
      throw error;
    }

    if (typeof window === "undefined") {
      return validatedDraft;
    }

    try {
      window.localStorage.setItem(
        RESUME_STORAGE_KEY,
        exportResumeDraft(validatedDraft),
      );
      this.setStatus("saved");
    } catch (error) {
      // Quota exceeded / blocked storage — surface it instead of silently dropping the write.
      warn("Failed to persist resume draft to localStorage:", error);
      this.setStatus("error");
    }

    return validatedDraft;
  }

  load(): ResumeDraft {
    if (typeof window === "undefined") {
      return createDefaultResumeDraft();
    }

    const storedDraft = window.localStorage.getItem(RESUME_STORAGE_KEY);

    if (!storedDraft) {
      return createDefaultResumeDraft();
    }

    try {
      return importResumeDraft(storedDraft);
    } catch (error) {
      warn("Failed to parse stored resume draft, using default:", error);
      this.setStatus("error");
      return createDefaultResumeDraft();
    }
  }
}
