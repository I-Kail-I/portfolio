import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

function ReadState() {
  const { state } = useSidebar();
  return <span>{state}</span>;
}

describe('Sidebar', () => {
  it('throws useSidebar outside provider', () => {
    expect(() => render(<ReadState />)).toThrow(
      'useSidebar must be used within a SidebarProvider.',
    );
  });

  it('provider renders wrapper and children', () => {
    render(
      <SidebarProvider>
        <span>inner</span>
      </SidebarProvider>,
    );
    expect(document.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    expect(screen.getByText('inner')).toBeInTheDocument();
  });

  it('exposes expanded state by default', () => {
    render(
      <SidebarProvider>
        <ReadState />
      </SidebarProvider>,
    );
    expect(screen.getByText('expanded')).toBeInTheDocument();
  });

  it('renders static sidebar with menu', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible='none'>
          <SidebarHeader>Head</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manage</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Foot</SidebarFooter>
        </Sidebar>
      </SidebarProvider>,
    );
    expect(document.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage')).toBeInTheDocument();
  });

  it('renders trigger inside provider', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger data-testid='trigger' />
      </SidebarProvider>,
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });
});
