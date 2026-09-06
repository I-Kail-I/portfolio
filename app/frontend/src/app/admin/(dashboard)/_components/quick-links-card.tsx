'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type QuickLink = {
  label: string;
  href: string;
};

type QuickLinksCardProps = {
  links: QuickLink[];
};

export function QuickLinksCard({ links }: QuickLinksCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Quick links</CardDescription>
        <CardTitle className='text-xl'>Manage content</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-2'>
        {links.map((link) => (
          <Button
            key={link.href + link.label}
            nativeButton={false}
            variant='outline'
            size='sm'
            render={<Link href={link.href} />}
          >
            {link.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
