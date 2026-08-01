import { useEffect, useLayoutEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { useEditorRevision } from "@/features/resume-editor/state/editor-revision";

/** Asks every mounted `useAutoSave` to save now — see `flushOpenForms`. */
const FLUSH_EVENT = "resume-editor:flush-forms";

/** Every leaf path in a value tree, as react-hook-form names it: `items.0.url`. */
function* leafPaths(
  value: unknown,
  prefix = "",
): Generator<[string, unknown], void, void> {
  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      yield* leafPaths(child, prefix ? `${prefix}.${key}` : key);
    }
    return;
  }
  if (prefix) yield [prefix, value];
}

/** SAVE-FLOW.md invariant 6: read-then-replace actions (auto-sort) must flush first, or pending keystrokes are lost. */
export function flushOpenForms() {
  window.dispatchEvent(new Event(FLUSH_EVENT));
}

/**
 * Owns a section form's persistence both ways: debounced save on edit/unmount/hide/flush,
 * and re-seed (reset + abandon pending edit) when the draft is replaced externally. See SAVE-FLOW.md.
 */
export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  values: T,
  onSave: (values: T) => void,
  delay = 500,
) {
  const onSaveRef = useRef(onSave);
  useLayoutEffect(() => {
    onSaveRef.current = onSave;
  });

  const revision = useEditorRevision();
  const prevRevision = useRef(revision);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Serialized, not the object — invariant 1: getValues() returns nested objects by
  // reference and RHF mutates them in place, so an object snapshot would alias live values.
  const lastSavedRef = useRef<string>(JSON.stringify(values));

  useEffect(() => {
    if (revision === prevRevision.current) return;
    prevRevision.current = revision;
    clearTimeout(timerRef.current);
    lastSavedRef.current = JSON.stringify(values);
    // Invariant 4: reactCompiler memoizes field components so they never re-render after
    // mount, so a plain reset's DOM write-back never lands — walk the leaves and setValue each.
    form.reset(values, { keepFieldsRef: true });
    for (const [path, leaf] of leafPaths(values)) {
      form.setValue(path as never, leaf as never);
    }
  }, [revision, values, form]);

  useEffect(() => {
    // Invariant 2: idempotent and cancels any pending debounce, or a re-seed's half-applied
    // state could fire a save identical to what was just seeded and wipe the redo stack.
    const save = () => {
      clearTimeout(timerRef.current);
      const next = form.getValues();
      const serialized = JSON.stringify(next);
      if (serialized === lastSavedRef.current) return;
      // Marked saved only after onSave returns, so a throw leaves it stale and retries.
      onSaveRef.current(next);
      lastSavedRef.current = serialized;
    };

    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: () => {
        if (JSON.stringify(form.getValues()) === lastSavedRef.current) return;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(save, delay);
      },
    });

    // React cleanups don't run on a real page unload, so flush on hide too.
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") save();
    };
    window.addEventListener("pagehide", save);
    window.addEventListener(FLUSH_EVENT, save);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubscribe();
      clearTimeout(timerRef.current);
      window.removeEventListener("pagehide", save);
      window.removeEventListener(FLUSH_EVENT, save);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      save();
    };
  }, [form, delay]);
}
