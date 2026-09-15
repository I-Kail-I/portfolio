import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Work } from '@/generated/prisma/client';
import { Blog } from '@/generated/prisma/client';

const prisma = new PrismaService();

async function seedings() {
  const works: Omit<Work, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (let i = 0; i < 20; i++) {
    works.push({
      name: faker.company.name(),
      content: faker.lorem.paragraphs(10),
      description: faker.lorem.sentence(),
      image_url: faker.image.url(),
      image_id: null,
      badge: [faker.word.sample(), faker.word.sample()],
      is_selected: faker.datatype.boolean(),
      hover_text: faker.lorem.words(3),
    });
  }

  await prisma.work.createMany({
    data: works,
  });

  const blogs: Omit<Blog, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (let i = 0; i < 20; i++) {
    blogs.push({
      title: faker.commerce.productName(),
      badge: [faker.word.sample(), faker.word.sample()],
      content: faker.lorem.paragraphs(10),
      description: faker.lorem.sentence(),
      image_url: faker.image.url(),
      image_id: null,
      hover_text: faker.lorem.words(3),
    });
  }

  await prisma.blog.createMany({
    data: blogs,
  });
}

seedings()
  .then(async () => {
    console.log('Seeding completed successfully.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
