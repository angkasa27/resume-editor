import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface DraftStorage {
  load(): ResumeDraft;
  save(draft: ResumeDraft): ResumeDraft;
  /** Optional async-save status channel; synchronous storages (LocalDraftStorage) omit it and saving reads as instant. */
  getSaveStatus?(): SaveStatus;
  subscribeSaveStatus?(listener: (status: SaveStatus) => void): () => void;
}
