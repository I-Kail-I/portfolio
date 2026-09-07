import { CardsSection } from './_sections/cards-section';
import { ChartsSection } from './_sections/charts-section';
import { TableSection } from './_sections/table-section';

export default function Page() {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <CardsSection />
        <ChartsSection />
        <TableSection />
      </div>
    </div>
  );
}
