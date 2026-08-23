export function normalizeCollectionItem<T extends Record<string, unknown>>(
  item: T,
  defaults: T,
): T {
  const nextItem = { ...defaults, ...item } as Record<string, unknown>;

  Object.keys(nextItem).forEach((key) => {
    const defaultValue = defaults[key];
    const currentValue = nextItem[key];

    if (typeof defaultValue === "string" && typeof currentValue !== "string") {
      nextItem[key] = "";
    }

    if (Array.isArray(defaultValue) && !Array.isArray(currentValue)) {
      nextItem[key] = [];
    }
  });

  return nextItem as T;
}
