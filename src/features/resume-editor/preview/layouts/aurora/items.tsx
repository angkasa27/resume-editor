import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

/** Skills read as neutral tags under their category label. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item item-tagged">
      <h3 className="item-title">{item.categoryName}</h3>
      <ul className="tag-list">
        {item.skills.filter(Boolean).map((skill) => (
          <li key={skill} className="tag">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const auroraItemViews: LayoutSectionItemMap = {
  ...defaultItemViews,
  skills: SkillsItem,
};
