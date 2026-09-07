'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ApiStatusCardProps = {
  status?: string;
  isOffline: boolean;
};

export function ApiStatusCard({ status, isOffline }: ApiStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>API status</CardDescription>
        <CardTitle className='flex items-center gap-2 text-xl'>
          <span
            className={`size-3 rounded-full ${isOffline ? 'bg-destructive' : 'bg-green-500'}`}
          />
          {isOffline ? 'Offline' : (status ?? 'Online')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground text-sm'>
          {isOffline ? 'Backend unreachable.' : 'All systems responding.'}
        </p>
      </CardContent>
    </Card>
  );
}
