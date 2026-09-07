import {
  ContentTable,
  ContentTableSkeleton,
  type Column,
} from '../../(dashboard)/_components/content-table';
import type { AdminBlog } from '../blogs.dto';
import { DeleteBlogDialog } from './delete-blog-dialog';

const BLOGS_COLUMNS: Column<AdminBlog>[] = [
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
  {
    header: 'Badges',
    cell: (blog) => <span className='text-muted-foreground'>{blog.badge.length}</span>,
  },
  {
    header: 'Created',
    cell: (blog) => (
      <span className='text-muted-foreground'>
        {new Date(blog.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: (blog) => (
      <span className='flex justify-end gap-1' data-stop-row-click>
        <DeleteBlogDialog id={blog.id} title={blog.title} />
      </span>
    ),
  },
];

export function AdminBlogsTable({
  blogs,
  onSelect,
}: {
  blogs: AdminBlog[];
  onSelect: (id: string) => void;
}) {
  return (
    <ContentTable
      rows={blogs}
      columns={BLOGS_COLUMNS}
      emptyText='No blogs yet.'
      onRowClick={(blog) => onSelect(blog.id)}
    />
  );
}

export function AdminBlogsTableSkeleton() {
  return <ContentTableSkeleton columns={5} rows={5} />;
}
