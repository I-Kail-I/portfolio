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
  usePathname: () => (globalThis as any).__testPathname ?? '/',
  useRouter: () => ({ replace: mock(() => {}) }),
}));
mock.module('lenis/react', () => ({
  useLenis: () => null,
  ReactLenis: ({ children }: any) => <div data-testid='lenis'>{children}</div>,
}));
mock.module('../../app/admin/(dashboard)/_hooks/hook.client', () => ({
  useMe: () => ({ data: { first_name: 'Jane', last_name: 'Doe' } }),
  useLogout: () => ({ mutate: mock(() => {}), isPending: false }),
}));

import { Layout } from './layout';

describe('Layout', () => {
  it('renders user layout on public route', () => {
    (globalThis as any).__testPathname = '/';
    render(
      <Layout>
        <span>page</span>
      </Layout>,
    );
    expect(screen.getAllByText('Mikail Arianos').length).toBeGreaterThan(0);
    expect(screen.getByText('arianosmikail5@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('page')).toBeInTheDocument();
  });

  it('renders admin layout on /admin route', () => {
    (globalThis as any).__testPathname = '/admin';
    render(
      <Layout>
        <span>admin page</span>
      </Layout>,
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('admin page')).toBeInTheDocument();
  });
});

void mock;
