"use client";

import { GalleryThumbnailsIcon, PaletteIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleTab } from "@/features/resume-editor/editor/panels/style-tab";
import { TemplateGallery } from "@/features/resume-editor/editor/panels/template-gallery";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type DesignPanelProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onPresentationChange: (next: PdfPresentation) => void;
  /** Extra scroll padding — mobile clears its floating bottom nav. */
  scrollPaddingClassName?: string;
};

/** The Design surface: Template / Style tabs, shared by the desktop sidebar and mobile. */
export function DesignPanel({
  presentation,
  draft,
  onPresentationChange,
  scrollPaddingClassName,
}: DesignPanelProps) {
  const tabContentClassName = cn(
    "min-h-0 flex-1 overflow-y-auto p-3 @container/form",
    scrollPaddingClassName,
  );

  return (
    <Tabs defaultValue="template" className="flex h-full flex-col gap-0!">
      <div className="shrink-0 px-3 pt-3">
        <TabsList className="w-full">
          <TabsTrigger value="template">
            <GalleryThumbnailsIcon />
            Template
          </TabsTrigger>
          <TabsTrigger value="style">
            <PaletteIcon />
            Customize
          </TabsTrigger>
        </TabsList>
      </div>
      {/* The gallery scrolls internally so its filter row can sit still above the grid. */}
      <TabsContent
        value="template"
        className="min-h-0 flex-1 overflow-hidden @container/form"
      >
        <TemplateGallery
          draft={draft}
          presentation={presentation}
          onApply={onPresentationChange}
          scrollPaddingClassName={scrollPaddingClassName}
        />
      </TabsContent>
      <TabsContent value="style" className={tabContentClassName}>
        <StyleTab presentation={presentation} onChange={onPresentationChange} />
      </TabsContent>
    </Tabs>
  );
}
