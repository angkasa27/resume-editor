"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  getClientRect,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { ChevronRightIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { collectionItemFieldsByKey } from "@/features/resume-editor/forms/fields/sections";
import { CollectionItemDeleteDialog } from "@/features/resume-editor/forms/collection-item-delete-dialog";
import {
  getCollectionItemSummary,
  useCollectionItemsForm,
} from "@/features/resume-editor/forms/use-collection-items-form";
import { CollectionItemRow } from "@/features/resume-editor/editor/sections/collection-item-row";
import { EditorRow } from "@/features/resume-editor/editor/sections/editor-row";
import { RowDragHandle } from "@/features/resume-editor/editor/sections/row-drag-handle";
import { RowDeleteButton } from "@/features/resume-editor/editor/sections/row-delete-button";
import { useDndReorder } from "@/features/resume-editor/editor/sections/use-dnd-reorder";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CollectionSectionBodyProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
};

/** Headerless collection editor: drag-sortable rows expanding to their fields,
 * plus add and auto-save. Auto-sort/remove live on the section list row. */
export function CollectionSectionBody({
  draft,
  sectionKey,
  onSave,
}: CollectionSectionBodyProps) {
  const {
    config,
    form,
    formValues,
    currentItems,
    items,
    collapsedIds,
    toggleCollapsed,
    collapseAll,
    pendingDeleteIndex,
    setPendingDeleteIndex,
    toSectionValue,
  } = useCollectionItemsForm(draft, sectionKey);

  useAutoSave(form, formValues, (values) => {
    onSave(toSectionValue(values));
  });

  // Reorder stays in RHF (items.move), not the store — a store-side reorder would need a
  // remount, losing collapse state and dnd-kit ids mid-drop. Autosave still commits it.
  const { sensors, onDragEnd } = useDndReorder<string>((activeId, overId) => {
    const from = items.fields.findIndex((f) => f.id === activeId);
    const to = items.fields.findIndex((f) => f.id === overId);
    if (from < 0 || to < 0) return;
    items.move(from, to);
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const Fields = collectionItemFieldsByKey[sectionKey];
  const itemSummary = (index: number) =>
    getCollectionItemSummary(
      currentItems?.[index] as Record<string, unknown>,
      config.itemTitle,
      index,
    );

  return (
    <div className="flex flex-col gap-2">
      {items.fields.length === 0 ? (
        <Empty className="rounded-md border px-4 py-6">
          <EmptyDescription>
            No items added yet. Add the first item to bring this section into
            the preview.
          </EmptyDescription>
        </Empty>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          // Rows collapse on drag start, so cached rects are stale; `ignoreTransform`
          // makes remeasuring safe — else a displaced row measures at its displaced spot.
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
              measure: (element) =>
                getClientRect(element, { ignoreTransform: true }),
            },
          }}
          // Collapse everything: mixed heights make the swap preview unreadable — a
          // short row travels a tall card's full height before trading places.
          onDragStart={(event) => {
            setActiveId(String(event.active.id));
            collapseAll();
          }}
          onDragEnd={(event) => {
            setActiveId(null);
            onDragEnd(event);
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext
            items={items.fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* Row list — 8px, same as the section list. */}
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {items.fields.map((field, index) => (
                  <CollectionItemRow
                    key={field.id}
                    itemId={field.id}
                    summary={itemSummary(index)}
                    itemTitle={config.itemTitle}
                    open={!collapsedIds.has(field.id)}
                    onToggle={() => toggleCollapsed(field.id)}
                    onRequestDelete={() => setPendingDeleteIndex(index)}
                    deleteDisabled={items.fields.length === 1}
                  >
                    <Fields form={form as never} index={index} />
                  </CollectionItemRow>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
          {/* The dragged row lives here instead of in the list, so collapsing the list
              under it can't drag its layout origin out from under the cursor. */}
          {/* dropAnimation null: the list has already reordered by then, so the
              overlay would fly to the row's pre-drop rect. */}
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              // inert: a decorative copy of a row that's still in the list — it must not
              // duplicate the real row's button role or take focus.
              <div inert>
                <EditorRow
                  title={itemSummary(
                    items.fields.findIndex((f) => f.id === activeId),
                  )}
                  handle={<RowDragHandle label="" />}
                  indicator={
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/60" />
                  }
                  // Every slot the real row fills, or the overlay is shorter than
                  // the gap it left behind.
                  menu={
                    <RowDeleteButton
                      label={config.itemTitle.toLowerCase()}
                      onDelete={() => {}}
                    />
                  }
                  onActivate={() => {}}
                  className="cursor-grabbing shadow-lg"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <Button
        type="button"
        className="w-full"
        onClick={() => items.append(config.createItem() as never)}
      >
        <PlusIcon data-icon="inline-start" />
        {config.addLabel}
      </Button>
      <CollectionItemDeleteDialog
        pendingDeleteIndex={pendingDeleteIndex}
        onOpenChange={setPendingDeleteIndex}
        onRemove={items.remove}
        itemTitle={config.itemTitle}
      />
    </div>
  );
}
