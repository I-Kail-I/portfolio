/**
 * Splits a badge input on commas or whitespace.
 *
 * @example
 * parseBadges('Next.js, Postgres Tailwind') // ['Next.js', 'Postgres', 'Tailwind']
 */
export function parseBadges(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map((badge) => badge.trim())
    .filter(Boolean);
}
