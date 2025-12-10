import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Book } from '../books/entities/book.entity';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Genre, Book])],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
