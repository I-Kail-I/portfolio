'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StatCardProps = {
  label: string;
  value: number;
  isLoading: boolean;
};

export function StatCard({ label, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className='text-4xl'>{isLoading ? '–' : value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
