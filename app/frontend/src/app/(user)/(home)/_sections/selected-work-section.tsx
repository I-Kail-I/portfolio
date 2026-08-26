import SelectWorkCard from '../_components/select-work-card';

export default function SelectedWorkSection() {
  return (
    <div className='mt-20 flex min-h-screen justify-center md:mt-35'>
      <div className='container'>
        <div className='w-full'>
          <p className='font-semibold text-muted-foreground text-xs uppercase'>Selected Work</p>
        </div>

        <div className='mt-10 space-y-12 md:mt-20 md:space-y-27'>
          <SelectWorkCard
            title='Mikail'
            description='AI-assisted risk management SaaS for construction'
            hoverText='View case study'
            imageUrl='/projects/mikail.png'
            link='/projects/mikail'
            badge={['Next.js', 'TypeScript']}
          />

          <SelectWorkCard
            title='Mikail'
            description='AI-assisted risk  SaaS for construction'
            hoverText='View case srudy'
            imageUrl='/projects/mikail.png'
            link='/projects/mikail'
            badge={['Next.js', 'TypeScript']}
          />

          <SelectWorkCard
            title='Mikail'
            description='AI-assisted risk management SaaS for construction'
            hoverText='View case study'
            imageUrl='/projects/mikail.png'
            link='/projects/mikail'
            badge={['Next.js', 'TypeScript']}
          />
        </div>
      </div>
    </div>
  );
}
