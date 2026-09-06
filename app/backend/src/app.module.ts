import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { PrismaClientExceptionFilter } from './common/filter/prisma-client-exception.filter';
import { MorganMiddleware } from './common/middleware/morgan.middleware';
import { PrismaModule } from './lib/prisma/prisma.module';
import { RedisModule } from './lib/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './modules/health/health.controller';
import { isProduction } from './utils/check-env';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ImageModule } from './modules/image/image.module';
import { BlogModule } from './modules/blog/blog.module';
import { WorkModule } from './modules/work/work.module';
import { SelectedWorkModule } from './modules/work/selected-work/selected-work.module';

@Module({
  imports: [
    // Rate limiting
    ThrottlerModule.forRoot([
      isProduction
        ? {
            ttl: 60000,
            limit: 30,
          }
        : {
            ttl: 60000,
            limit: 1000,
          },
    ]),

    // Structured logging (Pino + Morgan)
    LoggerModule.forRoot({
      pinoHttp: {
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
              },
            },
        autoLogging: false,
      },
    }),

    // Feature modules
    PrismaModule,
    AuthModule,
    RedisModule,
    FileUploadModule,
    ImageModule,
    BlogModule,
    // SelectedWorkModule before WorkModule: else GET /work/:id swallows "selected"
    SelectedWorkModule,
    WorkModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
