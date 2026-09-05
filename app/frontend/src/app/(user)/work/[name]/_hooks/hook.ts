import { axiosInstance } from '@/lib/axios';
import { WorkListSchema, WorkSchema, type WorkType } from '../work.dto';

function slugToTitle(slug: string): string {
  const decoded = decodeURIComponent(slug);
  return decoded
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugify(name: string): string {
  return name.toLowerCase().split(' ').join('-');
}

export async function fetchWorkByName(slug: string): Promise<WorkType> {
  const decodedName = decodeURIComponent(slug).replace(/-/g, ' ');
  const titleName = slugToTitle(slug);

  const candidates = [titleName, decodedName, slug];

  for (const name of candidates) {
    try {
      const res = await axiosInstance.get(`/work/name/${encodeURIComponent(name)}`);
      return WorkSchema.parse(res.data);
    } catch {
      // try next candidate
    }
  }

  // Fallback: fetch all and match by slug (case-insensitive)
  // Useful when backend findByName is case-sensitive.
  const res = await axiosInstance.get('/work');
  const works = WorkListSchema.parse(res.data);
  const matched = works.find((w) => slugify(w.name) === slug.toLowerCase());
  if (matched) return matched;

  throw new Error(`Work not found: ${slug}`);
}
