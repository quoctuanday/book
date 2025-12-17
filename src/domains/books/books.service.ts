import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IBookRepository } from './domain/book.repository.interface';
import { BookAggregate } from './domain/book.aggregate';
import { GenresService } from '../genre/genres.service';
import { BookGenresService } from '../book-genres/book-genres.service';
import { CreateBookDto } from 'src/domains/books/dto/create-book.dto';

const BOOK_REPO = 'BOOK_REPO';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOK_REPO)
    private readonly bookRepo: IBookRepository,
    private readonly genresService: GenresService,
    private readonly bookGenresService: BookGenresService,
  ) {}

  async create(authorId: string, dto: CreateBookDto) {
    if (!dto.genreIds || dto.genreIds.length === 0) {
      throw new BadRequestException('At least one genre is required');
    }
    await this.genresService.ensureExists(dto.genreIds);

    const book = BookAggregate.createNew({
      title: dto.title,
      description: dto.description,
      coverUrl: dto.coverUrl,
      authorId,
    });

    const savedBook = await this.bookRepo.save(book);

    await this.bookGenresService.attach(savedBook.id!, dto.genreIds);

    return savedBook.toDTO();
  }

  async findById(bookId: string) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const genreIds = await this.bookGenresService.findGenreIdsByBookId(bookId);

    const genres = await this.genresService.findListByIds(genreIds);

    return {
      ...book.toDTO(),
      genres,
    };
  }
}
