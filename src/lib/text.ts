
export function present(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function cleanLabels(labels: string[] | undefined | null): string[] {
  return (labels ?? []).map((l) => l.trim()).filter(Boolean);
}
