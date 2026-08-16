import { render, screen, act, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  type ItemForm,
  TagInputField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

type SkillsValues = { items: { skills: string[] }[] };

function renderTagField(seed: string[]) {
  let form!: ReturnType<typeof useForm<SkillsValues>>;

  function Harness() {
    form = useForm<SkillsValues>({
      defaultValues: { items: [{ skills: seed }] },
    });
    return (
      <TagInputField
        form={form as unknown as ItemForm}
        name="items.0.skills"
        label="Skills"
      />
    );
  }

  render(<Harness />);
  return () => form.getValues("items.0.skills");
}

describe("TagInputField", () => {
  it("keeps both removals when two tags are removed in one batch", () => {
    // Each write used to rebuild from the `value` prop captured at render, so a
    // second removal before re-render filtered the stale array and put A back.
    const skills = renderTagField(["React", "Vue", "Svelte"]);

    act(() => {
      screen.getByLabelText("Remove React").click();
      screen.getByLabelText("Remove Vue").click();
    });

    expect(skills()).toEqual(["Svelte"]);
  });

  it("does not clobber a blur-committed tag with a concurrent removal", () => {
    // Clicking ✕ blurs the input first, committing the draft. Both writes come
    // from the same gesture, so the removal must not run off the pre-add array.
    const skills = renderTagField(["React", "Vue"]);
    const input = screen.getByLabelText("Skills").querySelector("input")!;

    act(() => {
      input.focus();
      fireEvent.change(input, { target: { value: "Svelte" } });
    });

    act(() => {
      input.blur();
      screen.getByLabelText("Remove React").click();
    });

    expect(skills()).toEqual(["Vue", "Svelte"]);
  });
});
