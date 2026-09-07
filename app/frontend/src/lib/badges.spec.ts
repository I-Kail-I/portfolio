import { describe, expect, it } from 'bun:test';
import { parseBadges } from './badges';

describe('parseBadges', () => {
  it('splits on commas', () => {
    expect(parseBadges('Next.js,Postgres')).toEqual(['Next.js', 'Postgres']);
  });

  it('splits on spaces', () => {
    expect(parseBadges('Next.js Postgres')).toEqual(['Next.js', 'Postgres']);
  });

  it('handles mixed separators and extras', () => {
    expect(parseBadges('  Next.js,  Postgres   Tailwind,')).toEqual([
      'Next.js',
      'Postgres',
      'Tailwind',
    ]);
  });

  it('returns empty for blank', () => {
    expect(parseBadges('   ')).toEqual([]);
  });
});
