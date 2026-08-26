import * as motion from 'motion/react-client';
import type { Variants } from 'motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function TextAnimations({ text }: { text: string }) {
  const words = text.split(' ').map((word, index) => ({
    id: `${word}-${index}`,
    word,
  }));

  return (
    <motion.span
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: false, amount: 0.5 }}
      className='inline'
      aria-label={text}
    >
      {words.map(({ id, word }, index) => (
        <motion.span key={id} variants={wordVariants} className='inline-block whitespace-pre'>
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}
