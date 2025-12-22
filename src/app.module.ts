import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from 'src/core/core.module';
import { UsersModule } from 'src/domains/users/users.module';
import { DatabaseModule } from 'src/common/config/database/database.module';
import { AuthModule } from 'src/domains/auth/auth.module';
import { RedisModule } from 'src/common/config/redis/redis.module';
import { GenresModule } from 'src/domains/genre/genres.module';
import { BooksModule } from 'src/domains/books/books.module';
import { ChaptersModule } from 'src/domains/chapters/chapters.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    BooksModule,
    GenresModule,
    ChaptersModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
      ],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
