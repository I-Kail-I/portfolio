import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/lib/prisma/prisma.service';

const prisma = new PrismaService();

const DEFAULT_WORK_COUNT = 12;
const SEED_WORK_COUNT = Number(process.argv[2] ?? DEFAULT_WORK_COUNT);

const TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'NestJS',
  'Express',
  'Prisma',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'GraphQL',
  'Supabase',
];

const HOVER_TEXTS = ['View case study', 'Explore project', 'Read more', 'See the details'];

const IMAGE_FORMATS = [
  { mime_type: 'image/jpeg', extension: 'jpg' },
  { mime_type: 'image/png', extension: 'png' },
  { mime_type: 'image/webp', extension: 'webp' },
] as const;

function titleCase(value: string): string {
  return value.replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

async function main(): Promise<void> {
  const count =
    Number.isInteger(SEED_WORK_COUNT) && SEED_WORK_COUNT > 0 ? SEED_WORK_COUNT : DEFAULT_WORK_COUNT;
  const selectedIndex = faker.number.int({ min: 0, max: count - 1 });

  const { count: removedWorks } = await prisma.work.deleteMany();
  const { count: removedImages } = await prisma.image.deleteMany();
  console.log(`removed ${removedWorks} work(s) and ${removedImages} image(s)`);

  for (let index = 0; index < count; index++) {
    const { mime_type, extension } = faker.helpers.arrayElement(IMAGE_FORMATS);
    const file_name = `${faker.string.uuid()}.${extension}`;
    const file_path = `uploads/images/${file_name}`;

    await prisma.work.create({
      data: {
        name: titleCase(faker.word.words(faker.number.int({ min: 2, max: 4 }))),
        content: faker.lorem.paragraphs({ min: 3, max: 6 }),
        description: faker.lorem.sentence({ min: 6, max: 16 }),
        image_url: file_path,
        badge: faker.helpers.arrayElements(TECH_STACK, { min: 2, max: 4 }),
        is_selected: index === selectedIndex,
        hover_text: faker.helpers.arrayElement(HOVER_TEXTS),
        image: {
          create: {
            file_path,
            file_name,
            mime_type,
            status: 'active',
          },
        },
      },
    });
  }

  console.log(`seeded ${count} work(s)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
