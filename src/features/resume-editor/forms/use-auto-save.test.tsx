import { render, renderHook, screen, act } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { EditorRevisionContext } from "@/features/resume-editor/state/editor-revision";
import {
  flushOpenForms,
  useAutoSave,
} from "@/features/resume-editor/forms/use-auto-save";

describe("useAutoSave", () => {
  it("persists the latest edit on unmount (the quick-back regression)", () => {
    // Reproduces the reported bug: edit a field, then go back before it blurs.
    // Persistence must not depend on validity/blur — any edit flushes on unmount.
    const onSave = vi.fn();
    const { result, unmount } = renderHook(() => {
      const form = useForm<{ name: string }>({ defaultValues: { name: "" } });
      useAutoSave(form, { name: "" }, onSave);
      return form;
    });

    act(() => {
      result.current.setValue("name", "Rescued", { shouldDirty: true });
    });

    unmount();

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Rescued" }),
    );
  });

  it("keeps saving nested edits after the first save (the aliasing regression)", async () => {
    // `getValues()` returns nested objects by reference and RHF mutates them in
    // place, so snapshotting the object made every later edit compare equal.
    const onSave = vi.fn();
    const seed = { items: [{ description: "a" }] };
    const { result } = renderHook(() => {
      const form = useForm<typeof seed>({ defaultValues: seed });
      useAutoSave(form, seed, onSave, 10);
      return form;
    });

    act(() => {
      result.current.setValue("items.0.description", "b", {
        shouldDirty: true,
      });
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
    expect(onSave).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setValue("items.0.description", "c", {
        shouldDirty: true,
      });
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave.mock.calls.at(-1)?.[0].items[0].description).toBe("c");
  });

  it("flushOpenForms persists the pending edit now, and only once", async () => {
    // Auto-sort reads stored items then bumps the revision, so a debounced edit is
    // both ignored by the sort and discarded by the re-seed unless flushed first.
    const onSave = vi.fn();
    const { result } = renderHook(() => {
      const form = useForm<{ name: string }>({ defaultValues: { name: "" } });
      useAutoSave(form, { name: "" }, onSave);
      return form;
    });

    act(() => {
      result.current.setValue("name", "Typed", { shouldDirty: true });
    });

    act(() => {
      flushOpenForms();
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Typed" }),
    );

    await act(() => new Promise((resolve) => setTimeout(resolve, 700)));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does not save when the form was never touched", () => {
    const onSave = vi.fn();
    const { unmount } = renderHook(() => {
      const form = useForm<{ name: string }>({ defaultValues: { name: "" } });
      useAutoSave(form, { name: "" }, onSave);
      return form;
    });

    unmount();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("flushes pending edits when the page is hidden", () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => {
      const form = useForm<{ name: string }>({ defaultValues: { name: "" } });
      useAutoSave(form, { name: "" }, onSave);
      return form;
    });

    act(() => {
      result.current.setValue("name", "Typed", { shouldDirty: true });
    });

    act(() => {
      window.dispatchEvent(new Event("pagehide"));
    });

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Typed" }),
    );
  });

  it("re-seeds the form on a revision change without saving (external replace)", async () => {
    // undo/redo/import bump the revision: the form must re-seed without writing its
    // old value back, which would clobber the replace and corrupt undo history.
    const onSave = vi.fn();

    function Field({
      values,
    }: {
      values: { name: string };
    }) {
      const form = useForm<{ name: string }>({ defaultValues: values });
      useAutoSave(form, values, onSave);
      return <input aria-label="name" {...form.register("name")} />;
    }
    function App({
      revision,
      values,
    }: {
      revision: number;
      values: { name: string };
    }) {
      return (
        <EditorRevisionContext.Provider value={revision}>
          <Field values={values} />
        </EditorRevisionContext.Provider>
      );
    }

    const { rerender } = render(<App revision={0} values={{ name: "a" }} />);
    rerender(<App revision={1} values={{ name: "b" }} />);

    expect((screen.getByLabelText("name") as HTMLInputElement).value).toBe("b");

    // Let the superseding window and any debounce elapse — the reset must not save.
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(onSave).not.toHaveBeenCalled();

    // Every later replace must re-seed too, and stay silent: half-applied states
    // arm the debounce, and firing it clears the redo stack.
    rerender(<App revision={2} values={{ name: "c" }} />);
    expect((screen.getByLabelText("name") as HTMLInputElement).value).toBe("c");

    rerender(<App revision={3} values={{ name: "d" }} />);
    expect((screen.getByLabelText("name") as HTMLInputElement).value).toBe("d");

    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(onSave).not.toHaveBeenCalled();
  });
});
