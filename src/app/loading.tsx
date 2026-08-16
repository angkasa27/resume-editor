import { Spinner } from "@/components/ui/spinner";

// Instant loading UI; mirrors the editor's in-app spinner so navigation feels consistent.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Spinner aria-hidden className="size-8 text-muted-foreground" />
        <p className="text-sm font-semibold tracking-tight">Loading</p>
      </div>
    </div>
  );
}
