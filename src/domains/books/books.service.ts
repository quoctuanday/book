import { Inject, Injectable } from '@nestjs/common';
import { BookAggregate } from 'src/domains/books/domain/book.aggregate';
import { IBookRepository } from 'src/domains/books/domain/book.repository.interface';
import { CreateBookDto } from 'src/domains/books/dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOK_REPO')
    private readonly bookRepo: IBookRepository,
  ) {}
  async create(authorId: string, dto: CreateBookDto) {
    const book = BookAggregate.createNew({
      title: dto.title,
      description: dto.description,
      coverImage: dto.coverImage,
      authorId,
    });

    const saved = await this.bookRepo.save(book);
    return saved.toDTO();
  }
}
