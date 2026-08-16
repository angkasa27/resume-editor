import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";

// Left-stacked variants: skills drop the `.meta` wrapper, languages drop
// `.item-row` and guard empty proficiency. Used by the rails (split, dossier,
// ledger) and left-edge layouts (crest, masthead). Different DOM/CSS from the
// canonical `_shared/items` — do not swap those in.
export function RailSkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <div>{commaJoin(item.skills)}</div>
    </div>
  );
}

export function RailLanguagesItem({
  item,
}: {
  item: SectionItem<"languages">;
}) {
  return (
    <div className="item">
      <h3 className="item-title">{item.language}</h3>
      {item.proficiency ? <div className="meta">{item.proficiency}</div> : null}
    </div>
  );
}
