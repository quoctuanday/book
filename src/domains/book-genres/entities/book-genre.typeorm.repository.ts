import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreRepository } from '../domain/book-genre.repository.interface';

@Injectable()
export class BookGenreTypeOrmRepository implements IBookGenreRepository {
  constructor(
    @InjectRepository(BookGenre)
    private readonly repo: Repository<BookGenre>,
  ) {}

  async attachGenres(bookId: string, genreIds: string[]) {
    const rows = genreIds.map((genreId) =>
      this.repo.create({ bookId, genreId }),
    );
    await this.repo.insert(rows);
  }

  async replaceGenres(bookId: string, genreIds: string[]) {
    await this.repo.delete({ bookId });
    if (genreIds.length > 0) {
      await this.attachGenres(bookId, genreIds);
    }
  }

  async removeByBook(bookId: string) {
    await this.repo.delete({ bookId });
  }

  async findGenreIdsByBook(bookId: string) {
    const rows = await this.repo.find({
      where: { bookId },
      select: ['genreId'],
    });
    return rows.map((r) => r.genreId);
  }
}
