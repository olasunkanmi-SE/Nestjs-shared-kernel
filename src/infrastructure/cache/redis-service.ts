import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string): Promise<unknown> {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: object, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  public async delete(key: string) {
    return this.cacheManager.del(key);
  }
}
