import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";

// Rail-only variants (sidebar, split): skills drop the `.meta` wrapper and languages drop
// `.item-row` + guard empty proficiency, since the rail stacks item headers vertically.
// Different DOM/CSS from the canonical `_shared/items` versions — do not swap those in.
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
