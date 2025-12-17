import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreRepository } from './domain/book-genre.repository.interface';

const BOOK_GENRE_REPO = 'BOOK_GENRE_REPO';

@Injectable()
export class BookGenresService {
  constructor(
    @Inject(BOOK_GENRE_REPO)
    private readonly repo: IBookGenreRepository,
  ) {}

  attach(bookId: string, genreIds: string[]) {
    return this.repo.attachGenres(bookId, genreIds);
  }

  replace(bookId: string, genreIds: string[]) {
    return this.repo.replaceGenres(bookId, genreIds);
  }

  removeByBook(bookId: string) {
    return this.repo.removeByBook(bookId);
  }

  async findGenreIdsByBookId(bookId: string): Promise<string[]> {
    return this.repo.findGenreIdsByBook(bookId);
  }
}
