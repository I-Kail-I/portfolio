import { BlogDetailSection } from '../_sections/blog-detail';

type Props = {
  params: Promise<{ title: string }>;
};

export default async function Page({ params }: Props) {
  const { title } = await params;

  return (
    <div>
      <BlogDetailSection title={title} />
    </div>
  );
}
