export function parseLimit(limit?: string): number {
  const parsed = Number(limit ?? 20);

  if (Number.isNaN(parsed)) {
    return 20;
  }

  return Math.min(Math.max(parsed, 1), 100);
}
