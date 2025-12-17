import { BookAggregate } from './book.aggregate';

export interface IBookRepository {
  save(book: BookAggregate): Promise<BookAggregate>;
  findById(id: string): Promise<BookAggregate | null>;
}
