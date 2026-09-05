import { Reveal } from '@/components/reveal';

export function CapabilitiesArcSection() {
  return (
    <section className='mt-10 w-full bg-background'>
      <div className='container mx-auto px-5 lg:px-0'>
        <div className='mx-auto max-w-3xl pt-24 pb-10 lg:pt-32 lg:pb-12'>
          <Reveal>
            <h2 className='max-w-2xl text-balance font-semibold text-4xl text-foreground leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl'>
              Systems that stay fast as your product grows.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className='mt-8 max-w-xl space-y-4 text-base text-muted-foreground leading-relaxed sm:text-lg'>
              <p>
                What gets shipped first, what waits, how infra holds under load. When product moves
                fast, architecture and delivery must move with it.
              </p>
              <p>
                I bring senior full-stack + DevOps thinking so what gets built is actually the right
                thing — and stays shippable. Small client roster, full focus.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
