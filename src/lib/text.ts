/** Returns the trimmed string, or undefined when it is missing or blank. */
export function present(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Drops blank labels so a `['']` array is treated like no labels at all. */
export function cleanLabels(labels: string[] | undefined | null): string[] {
  return (labels ?? []).map((l) => l.trim()).filter(Boolean);
}
