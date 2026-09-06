import { describe, expect, it } from 'bun:test';
import { render } from '@testing-library/react';
import { buildBuckets, ContentChart } from './content-chart';

function iso(date: Date) {
  return date.toISOString();
}

describe('buildBuckets', () => {
  it('buckets current month entries', () => {
    const now = iso(new Date());
    const buckets = buildBuckets([now], [now, now], []);
    const current = buckets.at(-1);
    expect(current?.works).toBe(1);
    expect(current?.blogs).toBe(2);
    expect(current?.images).toBe(0);
  });

  it('ignores entries older than 6 months', () => {
    const old = new Date();
    old.setMonth(old.getMonth() - 7);
    const buckets = buildBuckets([iso(old)], [iso(old)], [iso(old)]);
    expect(buckets.every((bucket) => bucket.works === 0 && bucket.blogs === 0 && bucket.images === 0)).toBe(true);
  });

  it('returns 6 month buckets', () => {
    expect(buildBuckets([], [], [])).toHaveLength(6);
  });
});

describe('ContentChart', () => {
  it('renders chart container', () => {
    const { container } = render(<ContentChart worksDates={[]} blogDates={[]} imageDates={[]} />);
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
