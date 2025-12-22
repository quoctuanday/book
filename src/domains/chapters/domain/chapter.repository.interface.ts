// domains/chapters/domain/chapter.repository.interface.ts
import { ChapterAggregate } from './chapter.aggregate';

export interface IChapterRepository {
  save(chapter: ChapterAggregate): Promise<ChapterAggregate>;

  findById(id: string): Promise<ChapterAggregate | null>;

  findByBookAndNumber(
    bookId: string,
    number: number,
  ): Promise<ChapterAggregate | null>;

  findByBookAndSlug(
    bookId: string,
    slug: string,
  ): Promise<ChapterAggregate | null>;

  findPublishedByBook(bookId: string): Promise<ChapterAggregate[]>;
  findByBookPaged(
    bookId: string,
    skip: number,
    take: number,
  ): Promise<[ChapterAggregate[], number]>;

  delete(id: string): Promise<void>;
}
