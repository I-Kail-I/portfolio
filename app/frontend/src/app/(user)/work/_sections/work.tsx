import WorkCard from '../_components/work-card';
import { Reveal } from '@/components/reveal';

export default function WorkSection() {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto'>
        <div className='mt-46'>
          <div>
            <h1 className='font-semibold text-6xl'>All of my works</h1>
            <p className='mt-5 text-lg text-muted-foreground'>
              All of my works that I already done with - Products partnerships and consulting
              engagements.
            </p>
          </div>

          <div className='mt-20 space-y-15'>
            {[1, 2, 3, 4].map((i) => (
              <Reveal once key={i}>
                <WorkCard
                  title='Constructer AI'
                  description='AI-assisted risk management SaaS for construction teams'
                  hoverText='From 5 hours of manual work to one click.'
                  imageUrl='/work/constructer-ai/overview.png'
                  hoverImageUrl='/work/constructer-ai/hover-detail.png'
                  link='/work/constructer-ai'
                  badge={[
                    'AI SAAS',
                    'DASHBOARD',
                    'AI AGENT WORKFLOWS',
                    'UX RESEARCH',
                    'PRODUCT STRATEGY',
                  ]}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
