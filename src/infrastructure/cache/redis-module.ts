import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './redis-service';
import * as Joi from 'joi';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            REDISHOST: Joi.string().required(),
            REDISPORT: Joi.number().required(),
          }),
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDISHOST'),
        port: configService.get<string>('REDISPORT'),
        ttl: configService.get<number>('TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule {}
