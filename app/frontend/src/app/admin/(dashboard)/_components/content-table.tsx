import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type ContentTableProps<T extends { id: string }> = {
  rows: T[];
  columns: Column<T>[];
  emptyText?: string;
  onRowClick?: (row: T) => void;
};

export function ContentTable<T extends { id: string }>({
  rows,
  columns,
  emptyText = 'No rows yet.',
  onRowClick,
}: ContentTableProps<T>) {
  if (rows.length === 0) {
    return <p className='text-muted-foreground text-sm'>{emptyText}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.header} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={onRowClick ? 'cursor-pointer' : undefined}
          >
            {columns.map((column) => (
              <TableCell key={column.header} className={column.className}>
                {column.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ContentTableSkeleton({ columns = 3, rows = 3 }: { columns?: number; rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className='h-4 w-20' />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className='h-4 w-32' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
