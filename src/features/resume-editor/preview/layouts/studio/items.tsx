import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

/** Skills read as chips here, so the comma run of the shared view would fight the theme. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <ul className="chip-list">
        {item.skills.filter(Boolean).map((skill) => (
          <li key={skill} className="chip">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      {item.proficiency ? (
        <span className="chip">{item.proficiency}</span>
      ) : null}
    </div>
  );
}

export const studioItemViews: LayoutSectionItemMap = {
  ...defaultItemViews,
  skills: SkillsItem,
  languages: LanguagesItem,
};
