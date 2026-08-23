import { useEffect, useLayoutEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { useEditorRevision } from "@/features/resume-editor/state/editor-revision";

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

/** Lands every open form's pending edit now. Invariant 6 — callers must re-read after. */
export function flushOpenForms() {
  window.dispatchEvent(new Event(FLUSH_EVENT));
}

/** A section form's persistence both ways: debounced save, and re-seed on external replace. See docs/save-flow.md. */
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
  // Invariant 1: a string, never the object — getValues() hands back nested
  // objects by reference and RHF mutates them in place.
  const lastSavedRef = useRef<string>(JSON.stringify(values));

  useEffect(() => {
    if (revision === prevRevision.current) return;
    prevRevision.current = revision;
    clearTimeout(timerRef.current);
    lastSavedRef.current = JSON.stringify(values);
    // Invariant 4: reactCompiler means the field components never re-render, so
    // reset's own write-back never lands. Keep the refs, then set every leaf.
    form.reset(values, { keepFieldsRef: true });
    for (const [path, leaf] of leafPaths(values)) {
      form.setValue(path as never, leaf as never);
    }
  }, [revision, values, form]);

  useEffect(() => {
    // Invariant 2: idempotent, and cancels the debounce it beats.
    const save = () => {
      clearTimeout(timerRef.current);
      const next = form.getValues();
      const serialized = JSON.stringify(next);
      if (serialized === lastSavedRef.current) return;
      // After onSave, never before: a throw must leave this dirty so it retries.
      onSaveRef.current(next);
      lastSavedRef.current = serialized;
    };

    const unsubscribe = form.subscribe({
      formState: { values: true },
      // No equality check — that serializes the whole form (photo data URL and
      // all) per keystroke just to skip arming a timer. Invariant 2 covers it.
      callback: () => {
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
