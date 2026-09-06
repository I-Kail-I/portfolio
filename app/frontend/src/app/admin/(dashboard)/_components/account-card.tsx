'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
type AccountCardProps = {
  name?: string;
  email?: string;
  memberSince?: string;
};

export function AccountCard({ name, email, memberSince }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Account</CardDescription>
        <CardTitle className='text-xl'>{name ?? '–'}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-1 text-sm'>
        <p className='text-muted-foreground'>{email ?? '–'}</p>
        <p className='text-muted-foreground'>
          {memberSince ? `Member since ${memberSince}` : '–'}
        </p>
      </CardContent>
    </Card>
  );
}
