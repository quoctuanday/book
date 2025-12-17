export interface IBookGenreRepository {
  attachGenres(bookId: string, genreIds: string[]): Promise<void>;
  replaceGenres(bookId: string, genreIds: string[]): Promise<void>;
  removeByBook(bookId: string): Promise<void>;
  findGenreIdsByBook(bookId: string): Promise<string[]>;
}
