<<<<<<< HEAD
/** Returns the trimmed string, or undefined when it is missing or blank. */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function present(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

<<<<<<< HEAD
/** Drops blank labels so a `['']` array is treated like no labels at all. */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function cleanLabels(labels: string[] | undefined | null): string[] {
  return (labels ?? []).map((l) => l.trim()).filter(Boolean);
}
