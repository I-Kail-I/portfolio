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
  usePathname: () => (globalThis as any).__testPathname ?? '/admin',
  useRouter: () => ({ replace: mock(() => {}) }),
}));
mock.module('lenis/react', () => ({
  useLenis: () => null,
  ReactLenis: ({ children }: any) => <div>{children}</div>,
}));
mock.module('../../app/admin/(dashboard)/_hooks/hook.client', () => ({
  useMe: () => ({ data: { first_name: 'Jane', last_name: 'Doe' } }),
  useLogout: () => ({ mutate: mock(() => {}), isPending: false }),
}));

import { AdminSidebar } from './admin-sidebar';
import { SidebarProvider } from '../ui/sidebar';

function renderSidebar() {
  return render(
    <SidebarProvider>
      <AdminSidebar />
    </SidebarProvider>,
  );
}

describe('AdminSidebar', () => {
  it('renders user name and nav labels', () => {
    (globalThis as any).__testPathname = '/admin';
    renderSidebar();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  it('renders view site and logout', () => {
    (globalThis as any).__testPathname = '/admin';
    renderSidebar();
    expect(screen.getByText('View site')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('links to admin routes', () => {
    (globalThis as any).__testPathname = '/admin';
    renderSidebar();
    expect(document.querySelector('a[href="/admin"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/admin/works"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/admin/images"]')).toBeInTheDocument();
  });
});

void mock;
