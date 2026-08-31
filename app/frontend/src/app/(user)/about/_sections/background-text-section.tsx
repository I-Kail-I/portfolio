import { ScrollRevealText } from "../_components/scroll-reveal-text";

const BIO_TEXT = `
I'm a full-stack engineer and DevOps enthusiast deeply fascinated by how software turns abstract logic into tangible systems. My journey into programming officially began in 2024, starting directly with frontend design before expanding across the entire stack.

I fell in love with coding because of a simple reality: solving problems in real life is often too expensive, slow, or risky. Programming gives you a sandbox to model complex logic, break things apart, and engineer efficient solutions with zero physical friction.

Over the course of my build journey, I've cultivated a broad technical stack spanning client-side interactive tools and resilient backend infrastructure. On the application side, I work across NestJS, Laravel, Express, Next.js, React, Tailwind CSS, and Bootstrap. On the operations side, I bridge development with deployment using Docker, automated CI/CD pipelines, Terraform, and Kubernetes.

I drive my daily workflows on Linux — with Ubuntu as my distro of choice — embracing the control, speed, and command-line efficiency it provides for modern software development.

Based in Indonesia, I speak native Indonesian and fluent English, constantly exploring new tooling, building out projects, and refining my engineering toolkit.
`;

export function BackgroundTextSection() {
  return (
    <div className='flex min-h-[220vh] justify-center'>
      <ScrollRevealText
        text={BIO_TEXT}
        className='max-w-2xl px-6 py-[50vh] font-medium text-2xl text-white md:text-3xl'
      />
    </div>
  );
}
