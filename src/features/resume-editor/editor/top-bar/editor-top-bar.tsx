"use client";

import Link from "next/link";
import {
  CheckIcon,
  ChevronDownIcon,
  DownloadIcon,
  FileDownIcon,
  Redo2Icon,
  TriangleAlert,
  Undo2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/features/resume-editor/domain/draft/local-draft-storage";

type EditorTopBarProps = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** The primary output action — renders the Download PDF button. */
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onExportJson: () => void;
};

export function EditorTopBar({
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExportPdf,
  isExportingPdf,
  onExportJson,
}: EditorTopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 sm:gap-3 sm:px-4 print:hidden">
      <Link href="/">
        <h1 className="font-bold italic pr-1 bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-indigo-600">
          Resummme
        </h1>
      </Link>

      <SaveStatusIndicator status={saveStatus} />

      <div className="flex-1" />

      <ButtonGroup>
        <Button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          variant="outline"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <Undo2Icon className="size-4" />
          <span className="hidden md:flex">Undo</span>
        </Button>
        <Button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          variant="outline"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <Redo2Icon className="size-4" />
          <span className="hidden md:flex">Redo</span>
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          type="button"
          onClick={onExportPdf}
          disabled={isExportingPdf}
          aria-busy={isExportingPdf}
          size="sm"
        >
          {isExportingPdf ? (
            <Spinner aria-hidden className="size-4" />
          ) : (
            <DownloadIcon className="size-4" />
          )}
          {/* Label yields under 360px, where it'd push the menu off-screen.
              `sr-only`, not `hidden`, so the button keeps its name there. */}
          <span className="sr-only min-[360px]:not-sr-only">
            {isExportingPdf ? "Generating PDF…" : "Download PDF"}
          </span>
        </Button>
        <ButtonGroupSeparator className="bg-primary-foreground/25" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" size="icon-sm" aria-label="More file actions">
                <ChevronDownIcon className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onExportJson}>
              <FileDownIcon className="size-4" />
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </header>
  );
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  // "idle" only holds until the first save of the session — nothing to report yet.
  if (status === "idle") return null;

  const config = {
    saved: {
      icon: <CheckIcon className="size-3.5" />,
      label: "Saved",
      className: "text-muted-foreground",
    },
    error: {
      icon: <TriangleAlert className="size-3.5" />,
      label: "Save failed",
      className: "text-destructive",
    },
  }[status];

  return (
    <span
      className={cn("flex items-center gap-1 text-xs", config.className)}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}
