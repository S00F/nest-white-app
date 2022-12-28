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

function awsS3config(
  configurationService: ConfigurationService,
): AwsS3Configuration {
  return {
    AWS_BUCKET_NAME: configurationService.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: configurationService.AWS_ACCESS_KEY_ID,
    AWS_END_POINT: configurationService.AWS_END_POINT,
    AWS_REGION: configurationService.AWS_REGION,
    AWS_SECRET_ACCESS_KEY: configurationService.AWS_SECRET_ACCESS_KEY,
  };
}

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
  {
    provide: AwsS3Client,
    useFactory: (configurationService: ConfigurationService) => {
      return new AwsS3Client(awsS3config(configurationService));
    },
    inject: [ConfigurationService],
  },
  {
    provide: AwsS3EmailTemplate,
    useFactory: (configurationService: ConfigurationService) => {
      return new AwsS3EmailTemplate(awsS3config(configurationService));
    },
    inject: [ConfigurationService],
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
