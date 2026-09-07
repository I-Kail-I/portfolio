import type { BlogType } from '../blog.dto';
import { ContentTable, ContentTableSkeleton, type Column } from './content-table';

const BLOG_COLUMNS: Column<BlogType>[] = [
  {
    header: 'Title',
    cell: (blog) => <span className='font-medium'>{blog.title}</span>,
  },
  {
    header: 'Description',
    cell: (blog) => (
      <span className='block max-w-60 truncate text-muted-foreground'>{blog.description}</span>
    ),
  },
];

export function BlogsTable({ blogs }: { blogs: BlogType[] }) {
  return <ContentTable rows={blogs} columns={BLOG_COLUMNS} emptyText='No blogs yet.' />;
}

export function BlogsTableSkeleton() {
  return <ContentTableSkeleton columns={2} rows={3} />;
}
