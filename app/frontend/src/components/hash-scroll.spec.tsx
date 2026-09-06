import { afterEach, describe, expect, it, mock } from 'bun:test';
import { render } from '@testing-library/react';

mock.module('lenis/react', () => ({
  useLenis: () => null,
  ReactLenis: ({ children }: any) => <div>{children}</div>,
}));

import { HashScroll } from './hash-scroll';

afterEach(() => {
  window.location.hash = '';
  document.body.innerHTML = '';
});

describe('HashScroll', () => {
  it('renders nothing', () => {
    const { container } = render(<HashScroll />);
    expect(container.innerHTML).toBe('');
  });

  it('does nothing without hash', () => {
    window.location.hash = '';
    expect(() => render(<HashScroll />)).not.toThrow();
  });

  it('scrolls to hashed element', async () => {
    const scrollIntoView = mock(() => {});
    document.body.innerHTML = '<div id="target">hi</div>';
    const el = document.getElementById('target')!;
    el.scrollIntoView = scrollIntoView as unknown as typeof el.scrollIntoView;
    window.location.hash = '#target';

    render(<HashScroll />);
    await new Promise((r) => setTimeout(r, 300));
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('ignores missing element', async () => {
    window.location.hash = '#nope';
    render(<HashScroll />);
    await new Promise((r) => setTimeout(r, 300));
    expect(document.getElementById('nope')).toBeNull();
  });
});
