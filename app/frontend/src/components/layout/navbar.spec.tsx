import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

mock.module('next/link', () => ({
  default: ({ href, children, onClick, ...props }: any) => (
    <a href={typeof href === 'string' ? href : '#'} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));
mock.module('next/navigation', () => ({
  usePathname: () => (globalThis as any).__testPathname ?? '/work',
  useRouter: () => ({ replace: mock(() => {}) }),
}));
mock.module('lenis/react', () => ({
  useLenis: () => null,
  ReactLenis: ({ children }: any) => <div>{children}</div>,
}));

import { Navbar } from './navbar';

describe('Navbar', () => {
  it('renders brand and nav items', () => {
    (globalThis as any).__testPathname = '/work';
    render(<Navbar />);
    expect(screen.getAllByText('Mikail Arianos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Work').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Service').length).toBeGreaterThan(0);
  });

  it('links to slugs and contact', () => {
    (globalThis as any).__testPathname = '/work';
    render(<Navbar />);
    expect(document.querySelector('a[href="/work"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/about"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/service"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/contact"]')).toBeInTheDocument();
  });

  it('expands mobile menu on toggle', async () => {
    (globalThis as any).__testPathname = '/work';
    const userEvent = (await import('@testing-library/user-event')).default;
    render(<Navbar />);
    const toggle = document.querySelector(
      'button[aria-controls="mobile-nav-links"]',
    ) as HTMLElement;
    expect(toggle).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });
});

void mock;
