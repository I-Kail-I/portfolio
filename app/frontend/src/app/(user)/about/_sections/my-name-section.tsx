'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

import { SkillPill } from '../_components/skills-pill';

const SKILLS = [
  'DevOps',
  'Full-Stack Developer',
  'Product Design',
  'Docker',
  'Kubernetes',
  'AWS',
  'Terraform',
  'CI/CD',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'Linux',
  'Laravel',
  'MySQL',
  'NestJS',
  'Express',
  'Tailwind',
  'bootstrap',
  'Portainer',
  'Dokploy',
  'PHP',
  'JavaScript',
  'Caddy',
  'Nginx',
  'Composer',
];

export function MyNameSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillElsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cancelled = false;
    const cleanupFns: Array<() => void> = [];

    const ready = document.fonts?.ready ?? Promise.resolve();

    ready.then(() => {
      if (cancelled) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      if (prefersReducedMotion) {
        SKILLS.forEach((_, i) => {
          const el = pillElsRef.current[i];
          if (!el) return;
          const x = 60 + Math.random() * (width - 120);
          const y = 60 + Math.random() * (height - 120);
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          el.style.opacity = '1';
        });
        return;
      }

      const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

      const engine = Engine.create();
      engine.gravity.y = 0.6;

      // Only Bottom, Left, and Right walls.
      // Top wall is removed so pills can fall from above the screen.
      const wallOpts = { isStatic: true, render: { visible: false } };
      const walls = [
        Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts), // bottom [0]
        Bodies.rectangle(-25, height / 2, 50, height, wallOpts), // left [1]
        Bodies.rectangle(width + 25, height / 2, 50, height, wallOpts), // right [2]
      ];

      const bodies = SKILLS.map((_, i) => {
        const el = pillElsRef.current[i];
        if (!el) return null;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const x = 60 + Math.random() * (width - 120);
        // Spawn above the container
        const y = -h - Math.random() * height;
        return Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: h / 2 }, // pill-shaped collision body
          restitution: 0.4,
          friction: 0.15,
          frictionAir: 0.02,
        });
      }).filter((b): b is Matter.Body => b !== null);

      Composite.add(engine.world, [...walls, ...bodies]);

      // Mouse dragging
      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Composite.add(engine.world, mouseConstraint);
      container.style.touchAction = 'none';
      container.style.cursor = 'grab';

      const runner = Runner.create();
      Runner.run(runner, engine);

      const syncEl = () => {
        bodies.forEach((body, i) => {
          const el = pillElsRef.current[i];
          if (!el) return;
          el.style.transform = `translate(-50%, -50%) translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
          if (el.style.opacity !== '1') el.style.opacity = '1';
        });
      };
      Events.on(runner, 'afterTick', syncEl);

      const onResize = () => {
        // Matter doesn't auto-resize walls; reposition them on window resize
        Body.setPosition(walls[0], {
          // bottom wall
          x: container.clientWidth / 2,
          y: container.clientHeight + 25,
        });
        Body.setPosition(walls[2], {
          // right wall
          x: container.clientWidth + 25,
          y: container.clientHeight / 2,
        });
      };
      window.addEventListener('resize', onResize);

      cleanupFns.push(() => {
        window.removeEventListener('resize', onResize);
        Events.off(runner, 'afterTick', syncEl);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        // Clean up mouse scroll listener safely
        if (mouseConstraint.mouse) {
          const mc = mouseConstraint.mouse as any;
          if (mc.mousewheel) {
            mouse.element.removeEventListener('mousewheel', mc.mousewheel);
          }
        }
      });
    });

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => {
        fn();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative flex h-screen max-h-screen select-none items-center justify-center overflow-hidden'
    >
      <h1 className='pointer-events-none relative z-10 font-light text-2xl text-muted-foreground'>
        Hi, my name is Mikail.
      </h1>

      {SKILLS.map((text, i) => (
        <div
          key={text}
          ref={(el) => {
            pillElsRef.current[i] = el;
          }}
          className='absolute top-0 left-0 opacity-0 will-change-transform'
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <SkillPill text={text} />
        </div>
      ))}
    </div>
  );
}
