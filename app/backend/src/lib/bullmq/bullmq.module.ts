import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ImageCleanupModule } from './image-cleanup/image-cleanup.module';

function buildRedisConnection() {
  const url = process.env.REDIS_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname || 'localhost',
        port: Number(parsed.port || 6379),
        password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
        username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
        db: parsed.pathname?.length > 1 ? Number(parsed.pathname.slice(1)) : undefined,
      };
    } catch {
      return url;
    }
  }
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  };
}

@Module({
  imports: [
    BullModule.forRoot({
      connection: buildRedisConnection(),
    }),
    ImageCleanupModule,
  ],
})
export class BullmqModule {}
