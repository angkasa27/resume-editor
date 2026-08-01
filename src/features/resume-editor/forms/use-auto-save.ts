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

/**
 * Persists any in-flight edit in the open section form, right now.
 *
 * For store actions that *read* the draft and then bump the revision (auto-sort):
 * without this the pending keystrokes are both ignored by the action and thrown
 * away by the re-seed. Deliberately not used by undo/redo/import — those replace
 * the draft, so flushing first is exactly the clobber the re-seed prevents.
 */
export function flushOpenForms() {
  window.dispatchEvent(new Event(FLUSH_EVENT));
}

/**
 * Owns a section form's persistence in both directions:
 *
 * - **Save** — a trailing debounce on each edit, also run on unmount (drilling
 *   back), on page hide/close, and on `flushOpenForms`. Idempotent, and never
 *   gated on validity: the stored schema is lenient, so no edit is dropped for
 *   being mid-typed. "Has something to save" compares the live values against
 *   the last-saved snapshot synchronously, so even type-then-immediately-back
 *   persists.
 * - **Re-seed** — when the draft is replaced externally (import/undo/redo, which
 *   bump the store revision), reset the form to the new values and abandon any
 *   pending edit, so a stale in-progress value can't be flushed back over the
 *   replacement (which would also corrupt undo history).
 *
 * `values` is the section's current persisted value (the form's seed).
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
  // The values as of the last persist (or seed/re-seed), *serialized*. A flush
  // saves only when the live form differs from this, so an open-then-back with
  // no edit is a no-op (and doesn't add an undo entry). Stored as a string, not
  // the object: `getValues()` hands back nested objects (collection items) by
  // reference and RHF mutates them in place, so keeping the object would make
  // the snapshot alias the live values — every later edit would compare equal
  // and never save.
  const lastSavedRef = useRef<string>(JSON.stringify(values));

  useEffect(() => {
    if (revision === prevRevision.current) return;
    prevRevision.current = revision;
    clearTimeout(timerRef.current);
    lastSavedRef.current = JSON.stringify(values);
    // Reset, then write every value into its live input.
    //
    // A plain `reset` only updates react-hook-form's own state and leaves the
    // DOM to catch up when `register` re-attaches on the next render. That
    // render never comes here: the app builds with `reactCompiler`, which
    // memoizes the field components on props that never change (`form` is a
    // stable ref, `name`/`label` are constants), so they don't re-render after
    // mount. Left alone, the store reverts while the inputs keep showing the
    // replaced text — which the next keystroke then saves straight back.
    //
    // `keepFieldsRef` preserves the registered refs so `setValue` can reach the
    // inputs. It doesn't do the writing for us: reset empties RHF's mounted-name
    // list, so its own `setValue` pass — and `setValues` — go silent from the
    // second re-seed on. Walking the leaves addresses each field by name, which
    // needs no such list.
    form.reset(values, { keepFieldsRef: true });
    for (const [path, leaf] of leafPaths(values)) {
      form.setValue(path as never, leaf as never);
    }
  }, [revision, values, form]);

  useEffect(() => {
    // Idempotent: saves only a real change, and cancels any debounce it beats.
    // Both matter — a re-seed applies its values field by field, and those
    // half-applied states schedule a save that would otherwise fire and commit
    // values identical to the ones just seeded, wiping the redo stack.
    const save = () => {
      clearTimeout(timerRef.current);
      const next = form.getValues();
      const serialized = JSON.stringify(next);
      if (serialized === lastSavedRef.current) return;
      // Mark as saved only once the persist actually returned. If it throws
      // (a schema the store rejects), the snapshot stays stale so the next
      // edit — or the unmount flush — retries instead of silently concluding
      // the values are already on disk.
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
