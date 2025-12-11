import { ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const createDatabaseConfig = (
  config: ConfigService,
): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: Number(config.get<string>('DB_PORT', '3306')),
    username: config.get<string>('DB_USERNAME', 'root'),
    password: config.get<string>('DB_PASSWORD', ''),
    database: config.get<string>('DB_DATABASE', 'book_reader'),

    entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../../migrations/*{.ts,.js}'],

    synchronize: config.get<string>('DB_SYNC') === 'true',
    logging: config.get<string>('DB_LOGGING') === 'true',
  };
};
