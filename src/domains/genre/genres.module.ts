import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { GenreTypeOrmRepository } from 'src/domains/genre/entities/genre.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenresController],
  providers: [
    GenresService,
    {
      provide: 'GENRE_REPO',
      useClass: GenreTypeOrmRepository,
    },
  ],
  exports: ['GENRE_REPO', GenresService],
})
export class GenresModule {}
