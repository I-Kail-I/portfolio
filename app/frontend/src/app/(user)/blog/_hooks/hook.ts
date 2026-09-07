import { axiosInstance } from '@/lib/axios';
import { BlogListSchema, BlogSchema, type BlogType } from '../blog.dto';

export async function fetchBlogs(): Promise<BlogType[]> {
  const response = await axiosInstance.get('/blog');

  return BlogListSchema.parse(response.data);
}

function slugToTitle(slug: string): string {
  const decoded = decodeURIComponent(slug);
  return decoded
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugify(title: string): string {
  return title.toLowerCase().split(' ').join('-');
}

export async function fetchBlogByTitle(slug: string): Promise<BlogType> {
  const decodedTitle = decodeURIComponent(slug).replace(/-/g, ' ');
  const titleName = slugToTitle(slug);

  const candidates = [titleName, decodedTitle, slug];

  for (const title of candidates) {
    try {
      const res = await axiosInstance.get(`/blog/title/${encodeURIComponent(title)}`);
      return BlogSchema.parse(res.data);
    } catch {
      // try next candidate
    }
  }

  // Fallback: fetch all and match by slug (case-insensitive)
  // Useful when backend findByTitle is case-sensitive.
  const res = await axiosInstance.get('/blog');
  const blogs = BlogListSchema.parse(res.data);
  const matched = blogs.find((b) => slugify(b.title) === slug.toLowerCase());
  if (matched) return matched;

  throw new Error(`Blog not found: ${slug}`);
}
