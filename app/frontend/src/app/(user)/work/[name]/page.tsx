import { WorkDetailSection } from './_sections/work-detail';

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;

  return (
    <div>
      <WorkDetailSection name={name} />
    </div>
  );
}
