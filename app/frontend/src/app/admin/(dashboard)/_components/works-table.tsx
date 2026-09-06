import { StarIcon } from 'lucide-react';
import type { WorkType } from '@/app/(user)/work/work.dto';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type WorksTableProps = {
  works: WorkType[];
};

export function WorksTable({ works }: WorksTableProps) {
  if (works.length === 0) {
    return <p className='text-muted-foreground text-sm'>No works yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Selected</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {works.map((work) => (
          <TableRow key={work.id}>
            <TableCell className='font-medium'>{work.name}</TableCell>
            <TableCell className='max-w-60 truncate text-muted-foreground'>
              {work.description}
            </TableCell>
            <TableCell>
              {work.is_selected && (
                <StarIcon className='size-4 text-[#f5bd22]' aria-label='Selected' />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function WorksTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Selected</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-48' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-4' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
