import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookGenre } from './entities/book-genre.entity';
import { BookGenresService } from './book-genres.service';
import { BookGenreTypeOrmRepository } from './entities/book-genre.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookGenre])],
  providers: [
    BookGenresService,
    {
      provide: 'BOOK_GENRE_REPO',
      useClass: BookGenreTypeOrmRepository,
    },
  ],
  exports: [BookGenresService],
})
export class BookGenresModule {}
