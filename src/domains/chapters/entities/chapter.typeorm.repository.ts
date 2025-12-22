// domains/chapters/infrastructure/chapter.typeorm.repository.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Chapter } from '../entities/chapter.entity';
import { ChapterAggregate } from '../domain/chapter.aggregate';
import { IChapterRepository } from '../domain/chapter.repository.interface';

export class ChapterTypeOrmRepository implements IChapterRepository {
  constructor(
    @InjectRepository(Chapter)
    private readonly repo: Repository<Chapter>,
  ) {}

  private toAggregate(entity: Chapter): ChapterAggregate {
    return ChapterAggregate.reconstitute({
      id: entity.id,
      bookId: entity.bookId,
      number: entity.number,
      slug: entity.slug,
      title: entity.title,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async save(chapter: ChapterAggregate): Promise<ChapterAggregate> {
    const entity = this.repo.create({
      id: chapter.id,
      bookId: chapter.bookId,
      number: chapter.number,
      slug: chapter.slug,
      title: chapter.title,
      publishedAt: chapter.publishedAt,
    });

    const saved = await this.repo.save(entity);
    return this.toAggregate(saved);
  }

  async findById(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toAggregate(entity) : null;
  }

  async findByBookAndNumber(bookId: string, number: number) {
    const entity = await this.repo.findOne({
      where: { bookId, number },
    });
    return entity ? this.toAggregate(entity) : null;
  }

  async findByBookAndSlug(bookId: string, slug: string) {
    const entity = await this.repo.findOne({
      where: { bookId, slug },
    });
    return entity ? this.toAggregate(entity) : null;
  }

  async findPublishedByBook(bookId: string) {
    const entities = await this.repo.find({
      where: {
        bookId,
        publishedAt: Not(IsNull()),
      },
      order: { number: 'ASC' },
    });

    return entities.map((e) => this.toAggregate(e));
  }
  async findByBookPaged(
    bookId: string,
    skip: number,
    take: number,
  ): Promise<[ChapterAggregate[], number]> {
    const [entities, total] = await this.repo.findAndCount({
      where: { bookId },
      order: { number: 'ASC' },
      skip,
      take,
    });

    const aggregates = entities.map((e) => this.toAggregate(e));

    return [aggregates, total];
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
