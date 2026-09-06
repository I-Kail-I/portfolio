'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BriefcaseIcon,
  GlobeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  NewspaperIcon,
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { useLogout, useMe } from '../../app/admin/(dashboard)/_hooks/hook.client';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/works', label: 'Works', icon: BriefcaseIcon },
  { href: '/admin/blogs', label: 'Blogs', icon: NewspaperIcon },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me } = useMe();
  const { mutate: doLogout, isPending: isLoggingOut } = useLogout();

  const isActive = (href: string) => pathname === href;

  function onLogout() {
    doLogout(undefined, {
      onSuccess: () => {
        toast.add({ title: 'Logged out', description: 'See you soon.', type: 'success' });
        router.replace('/login');
      },
      onError: (logoutError) => {
        const msg = logoutError instanceof Error ? logoutError.message : 'Unknown error';
        toast.add({ title: 'Logout failed', description: msg, type: 'error' });
      },
    });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <p className='px-3 py-2 font-semibold text-sm'>
          {me ? `${me.first_name} ${me.last_name}` : 'Portfolio Admin'}
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span className={isActive(item.href) ? 'text-violet-400' : ''}>{item.label}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='View site'
                  render={
                    <Link href='/'>
                      <GlobeIcon />
                      <span>View site</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} disabled={isLoggingOut} tooltip='Logout'>
              {isLoggingOut ? <Spinner /> : <LogOutIcon />}
              <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
