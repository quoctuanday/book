import { ChapterContentModel } from './chapter-content.model';

export interface IChapterContentRepository {
  findByChapterId(chapterId: string): Promise<ChapterContentModel | null>;
  save(content: ChapterContentModel): Promise<void>;
}
