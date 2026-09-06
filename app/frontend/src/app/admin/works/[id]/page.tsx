import { WorkDetailSection } from './_sections/work-detail-section';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <WorkDetailSection id={id} />
    </div>
  );
}
