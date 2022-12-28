import { Inject } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 *
 * @export
 * @param {({ keyPrefix?: string; ttl: number | Function })} 
 * @returns
 */
export function Cache({
  keyPrefix,
  ttl,
}: {
  keyPrefix?: string;
  ttl: number | Function;
}) {
  const injectedCacheService = Inject(CacheService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectedCacheService(target, 'cacheService');
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
      const cacheService: CacheService = this.cacheService;

      keyPrefix = `${
        keyPrefix ? keyPrefix.concat(':') : ''
      }${target.constructor.name.toLocaleLowerCase()}:${propertyKey
        .toString()
        .toLocaleLowerCase()}${':'.concat(
        args ? args.map(a => JSON.stringify(a).toLocaleLowerCase()).join() : '',
      )}`;

      const cachedItem = await cacheService.get(keyPrefix);
      if (cachedItem) {
        return cachedItem;
      }

      const result = await originalMethod.apply(this, args);
      const calcTtl = typeof ttl === 'function' ? ttl() : ttl;
      await cacheService.set(keyPrefix, result, { ttl: calcTtl });
      return result;
    };
  };
}
