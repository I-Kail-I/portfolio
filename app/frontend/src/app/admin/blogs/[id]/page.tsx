import { BlogDetailSection } from './_sections/blog-detail-section';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <BlogDetailSection id={id} />
    </div>
  );
}
