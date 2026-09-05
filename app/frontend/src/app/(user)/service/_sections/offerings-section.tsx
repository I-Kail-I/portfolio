import { Reveal } from '@/components/reveal';
import { OfferCard } from '../_components/offer-card';

const offers = [
  {
    id: 'fullstack-partner',
    badges: ['0 \u2192 Launch', 'Full-Stack Build', 'MVP to Scale'],
    title: 'Full-Stack Partner',
    description:
      'For founders building without an engineer — bridging product vision and production with architecture, app development, and DevOps from day one.',
    bullets: [
      'You have a product idea, but no one to architect, build and ship it yet',
      'You have no senior engineer on the team, and you need a thinking partner — not just execution',
      'You shipped something rough that needs to become stable, scalable, and keep users coming back',
    ],
    htmlId: 'product',
    className: 'bg-[#c4b5fd]',
    buttonClassName: 'bg-black text-white hover:bg-black/85',
  },
  {
    id: 'devops-advisory',
    badges: ['Scalable Infra', 'Automated Pipelines', 'Reliable Operations'],
    title: 'DevOps Advisory for Product Teams',
    description:
      'For teams shipping without a senior infra voice — bringing clarity, automation, and reliable operations across your stack.',
    bullets: [
      'Your product is live, with real users and revenue depending on it',
      'You have developers on the team, but no senior voice owning infra and delivery',
      'Manual deploys, downtime, or slow releases are starting to cost you — in rework, risk, or churn',
    ],
    htmlId: 'consulting',
    className: 'bg-yellow-300',
    buttonClassName: ' text-black hover:bg-[#a48f00]',
  },
] as const;

export function OfferingsSection() {
  return (
    <section className='w-full bg-background py-16 lg:py-24'>
      <div className='container mx-auto px-5 lg:px-0'>
        <Reveal>
          <p className='font-semibold text-muted-foreground text-xs uppercase tracking-[0.14em]'>
            Built for the long game
          </p>
        </Reveal>

        <div className='mx-55 mt-12 grid gap-6 max-lg:mx-0 lg:mt-20 lg:grid-cols-2'>
          {offers.map((offer, index) => (
            <Reveal key={offer.id} delay={index * 0.12}>
              <OfferCard {...offer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
