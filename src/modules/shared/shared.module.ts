import {
  Module,
  Global,
  HttpModule,
  CacheModule,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationService } from './configuration/configuration.service';
import { CacheService } from './cache/cache.service';

const providers = [
  {
    provide: ConfigurationService,
    useValue: new ConfigurationService(process.env).ensureValues([
      'DB_ADDRESS',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'DB_SCHEMA',
    ]),
  },
  CacheService,
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configurationService: ConfigurationService) =>
        configurationService.getTypeOrmConfig(),
      inject: [ConfigurationService],
    }),
    CacheModule.registerAsync({
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getRedisConfig(),
      inject: [ConfigurationService],
    }),
  ],
  exports: [...providers, HttpModule, CacheModule],
})
export class SharedModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    const client = cacheManager.store.getClient();

    client.on('error', error => {
      console.error('Error when trying to connect to redis server...', error);
    });
  }
}
