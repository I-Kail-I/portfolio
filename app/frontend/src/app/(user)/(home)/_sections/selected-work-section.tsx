import { Reveal } from '@/components/reveal';
import SelectWorkCard from '../_components/select-work-card';

export default function SelectedWorkSection() {
  return (
    <div className='mt-20 flex min-h-screen justify-center md:mt-35'>
      <div className='container'>
        <div className='w-full'>
          <Reveal>
            <p className='font-semibold text-muted-foreground text-xs uppercase'>Selected Work</p>
          </Reveal>
        </div>

        <div className='mt-10 space-y-12 md:mt-20 md:space-y-27'>
          {[
            {
              id: 'mikail-risk-management',
              title: 'Mikail',
              description: 'AI-assisted risk management SaaS for construction',
              hoverText: 'View case study',
              imageUrl: '/projects/mikail.png',
              link: '/projects/mikail',
              badge: ['Next.js', 'TypeScript'],
            },
            {
              id: 'mikail-risk',
              title: 'Mikail',
              description: 'AI-assisted risk  SaaS for construction',
              hoverText: 'View case srudy',
              imageUrl: '/projects/mikail.png',
              link: '/projects/mikail',
              badge: ['Next.js', 'TypeScript'],
            },
            {
              id: 'mikail-risk-management-2',
              title: 'Mikail',
              description: 'AI-assisted risk management SaaS for construction',
              hoverText: 'View case study',
              imageUrl: '/projects/mikail.png',
              link: '/projects/mikail',
              badge: ['Next.js', 'TypeScript'],
            },
          ].map((card) => (
            <Reveal key={card.id}>
              <SelectWorkCard {...card} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
