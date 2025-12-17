import { GenreAggregate } from './genre.aggregate';

export interface IGenreRepository {
  save(genre: GenreAggregate): Promise<GenreAggregate>;
  findById(id: string): Promise<GenreAggregate | null>;
  findBySlug(slug: string): Promise<GenreAggregate | null>;
  findAll(): Promise<GenreAggregate[]>;
  findByIds(ids: string[]): Promise<GenreAggregate[]>;
}
