import { BookAggregate } from './book.aggregate';

export interface IBookRepository {
  save(book: BookAggregate): Promise<BookAggregate>;
  findById(id: string): Promise<BookAggregate | null>;
  findByAuthor(authorId: string): Promise<BookAggregate[]>;
  findAll(params: { page: number; limit: number }): Promise<{
    items: BookAggregate[];
    total: number;
  }>;
}
