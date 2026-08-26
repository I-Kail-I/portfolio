import * as motion from 'motion/react-client';

const texts = [
  '3+ Years of Experience',
  'Full-Stack Architecture & DevOps Engineering',
  'Automated CI/CD Pipelines, Kubernetes & AWS Orchestration',
  'Focus on Scalable Microservices, Cloud Infrastructure & Internal Tools',
  'Designing High-Availability Systems & Modern Web Applications',
  'Streamlining Developer Workflows & End-to-End Product Deployment',
  'Optimizing Database Performance & Site Reliability (SRE)',
  'Empowering engineering teams with resilient, production-ready cloud solutions',
];

export function MovingTextSection() {
  const loopTexts = [...texts, ...texts];

  return (
    <div className='group relative w-full overflow-hidden py-8'>
      <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent sm:w-24 lg:w-32' />
      <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent sm:w-24 lg:w-32' />

      <motion.div
        className='flex w-max items-center'
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 120,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {loopTexts.map((text, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: required for seamlessly duplicated looping content
          <div key={index} className='flex items-center'>
            <span className='whitespace-nowrap px-6 font-medium text-sm text-white/70'>{text}</span>
            <span className='text-white/20' aria-hidden='true'>
              |
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
