import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChapterContent } from './chapter-content.entity';
import { IChapterContentRepository } from '../domain/chapter-content.repository.interface';
import { ChapterContentModel } from '../domain/chapter-content.model';

export class ChapterContentTypeOrmRepository implements IChapterContentRepository {
  constructor(
    @InjectRepository(ChapterContent)
    private readonly repo: Repository<ChapterContent>,
  ) {}

  async findByChapterId(chapterId: string) {
    const entity = await this.repo.findOne({ where: { chapterId } });
    if (!entity) return null;

    return new ChapterContentModel(
      entity.id,
      entity.chapterId,
      entity.content,
      entity.updatedAt,
    );
  }

  async save(model: ChapterContentModel) {
    const entity = this.repo.create({
      id: model.id ?? undefined,
      chapterId: model.chapterId,
      content: model.content,
    });

    await this.repo.save(entity);
  }
}
