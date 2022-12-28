import smtpPool from 'nodemailer-smtp-pool';
import path from 'path';
import * as redisStore from 'cache-manager-redis-store';

export class ConfigurationService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing process.env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    // TODO DELETE CONDITION WHEN SETTING UP TEST ENVIREMENT
    if (!this.isTest()) keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV');
    return !(mode === 'development' || mode === 'test');
  }

  public isDevelopment() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'development';
  }

  public isTest() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'test';
  }

  public get HOST() {
    return this.getValue('HOST', false);
  }

  public get HTTP_PORT() {
    return Number(this.getValue('HTTP_PORT'));
  }

  public get GLOBAL_PREFIX() {
    return this.getValue('GLOBAL_PREFIX', false);
  }


  public get IS_GET_ALLOWED() {
    return Boolean(this.getValue('IS_GET_ALLOWED', false));
  }

  public getRedisConfig(): any {
    return {
      store: redisStore,
      host: this.getValue('REDIS_HOST'),
      port: parseInt(this.getValue('REDIS_PORT')),
      auth_pass: this.getValue('REDIS_PASSWORD'),
      db: parseInt(this.getValue('REDIS_DB')),
    };
  }

  public getTypeOrmConfig(): any {
    return {
      type: 'postgres',
      host: this.getValue('DB_ADDRESS'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      schema: this.getValue('DB_SCHEMA'),
      entities: [`${path.join(__dirname, '../..')}/**/*.entity{.ts,.js}`],
      synchronize: false,
      logging: true,
      migrationsTableName: 'migration',
      cli: {
        migrationsDir: 'src/migration',
      },
      ssl: Boolean(this.getValue('DB_SSL', false)),
    };
  }

  getSMTPConfig(): smtpPool.SmtpPoolOptions {
    return {
      host: this.getValue('SMTP_SERVER'),
      port: Number(this.getValue('SMTP_PORT')),
      secure: this.getValue('SMTP_SECURE') === 'true' || false,
      tls: {
        rejectUnauthorized: this.getValue('SMTP_TLS') === 'true' || false,
      },
    };
  }
}
