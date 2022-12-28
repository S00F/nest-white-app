import {
  CACHE_MANAGER,
  CacheManagerOptions,
  Inject,
  Injectable,
} from '@nestjs/common';

/**
 *
 *
 * @export
 * @interface CacheManager
 */
export interface CacheManager {
  store?: any;
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T, options?: CacheManagerOptions): Promise<T>;
  del(key: string): Promise<void>;
}
/**
 *
 * @export
 * @class CacheService
 */
@Injectable()
export class CacheService {
  private cache!: CacheManager;

  /**
   *Creates an instance of CacheService.
   * @param {CacheManager} cache
   * @memberof CacheService
   */
  constructor(@Inject(CACHE_MANAGER) cache: CacheManager) {
    this.cache = cache;
  }

  /**
   *
   * @template T
   * @param {string} key
   * @returns {Promise<T>}
   * @memberof CacheService
   */
  get<T>(key: string): Promise<T> {
    return this.cache.get(key);
  }

  /**
   *
   * @template T
   * @param {string} key
   * @param {T} value
   * @param {CacheManagerOptions} [options]
   * @returns {Promise<T>}
   * @memberof CacheService
   */
  set<T>(key: string, value: T, options?: CacheManagerOptions): Promise<T> {
    return this.cache.set(key, value, options);
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<void>}
   * @memberof CacheService
   */
  del(key: string): Promise<void> {
    return this.cache.del(key);
  }
}
