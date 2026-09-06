'use client';
import { ReactLenis } from 'lenis/react';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith('/admin');

  return isAdmin ? <AdminLayout>{children}</AdminLayout> : <UserLayout>{children}</UserLayout>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className='flex items-center gap-2 p-2'>
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserLayout({ children }: { children: React.ReactNode }) {
  const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: false,
    infinite: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      <Navbar />
      <div className='mx-5 md:mx-1'>{children}</div>
      <Footer />
    </ReactLenis>
  );
}
