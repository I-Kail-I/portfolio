import { Reveal } from '@/components/reveal';
import ServiceCard from '../_components/service-card';

const services = [
  {
    id: 'fullstack-partner',
    eyebrow: 'Full-Stack Partner',
    title: 'For founders building without an engineer',
    description:
      'Architecture, development and deployment in one ongoing partnership - for founders who need someone to think through the product, not just build it.',
    link: '/services/fullstack-partner',
    className: 'bg-purple-300',
    buttonClassName: 'bg-white/90 text-neutral-900 hover:bg-white/30',
  },
  {
    id: 'devops-advisory',
    eyebrow: 'DevOps Advisory for Product Teams',
    title: 'For teams shipping without a senior engineer',
    description:
      'Audits, CI/CD, infrastructure and ongoing advisory - for teams with developers but no senior voice setting direction.',
    link: '/services/devops-advisory',
    className: 'bg-yellow-300',
    buttonClassName: 'bg-yellow-400 text-neutral-900 hover:bg-yellow-400/40',
  },
];

export default function ServiceSection() {
  return (
    <div className='mt-45 w-full'>
      <div className='container mx-auto'>
        <div className='font-semibold text-muted-foreground text-xs uppercase'>
          <Reveal>
            <p>SERVICES</p>
          </Reveal>
        </div>

        <div className='mx-55 mt-20 grid gap-6 max-lg:mx-0 lg:grid-cols-2'>
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.15}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
