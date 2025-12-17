import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { GenresModule } from 'src/domains/genre/genres.module';
import { BookGenresModule } from 'src/domains/book-genres/book-genres.module';
import { BookTypeOrmRepository } from 'src/domains/books/entities/book.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), GenresModule, BookGenresModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: 'BOOK_REPO',
      useClass: BookTypeOrmRepository,
    },
  ],
  exports: [BooksService],
})
export class BooksModule {}
