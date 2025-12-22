import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { IChapterRepository } from './domain/chapter.repository.interface';
import { IChapterContentRepository } from './domain/chapter-content.repository.interface';
import { ChapterAggregate } from './domain/chapter.aggregate';
import { ChapterContentModel } from './domain/chapter-content.model';

@Injectable()
export class ChaptersService {
  constructor(
    @Inject('CHAPTER_REPO')
    private readonly chapterRepo: IChapterRepository,

    @Inject('CHAPTER_CONTENT_REPO')
    private readonly contentRepo: IChapterContentRepository,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateChapterDto) {
    const existed = await this.chapterRepo.findByBookAndNumber(
      dto.bookId,
      dto.number,
    );
    if (existed) {
      throw new BadRequestException('Chapter number already exists');
    }

    return this.dataSource.transaction(async () => {
      const chapter = ChapterAggregate.createNew({
        bookId: dto.bookId,
        number: dto.number,
        title: dto.title,
      });

      const saved = await this.chapterRepo.save(chapter);

      await this.contentRepo.save(
        new ChapterContentModel(null, saved.id, dto.content, new Date()),
      );

      return saved;
    });
  }

  async update(id: string, dto: UpdateChapterDto) {
    return this.dataSource.transaction(async () => {
      const chapter = await this.chapterRepo.findById(id);
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      if (dto.title !== undefined) {
        chapter.rename(dto.title);
        await this.chapterRepo.save(chapter);
      }

      if (dto.content !== undefined) {
        const content =
          (await this.contentRepo.findByChapterId(id)) ??
          new ChapterContentModel(null, id, '', new Date());

        content.updateContent(dto.content);
        await this.contentRepo.save(content);
      }

      return chapter;
    });
  }

  async listByBook(bookId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.chapterRepo.findByBookPaged(
      bookId,
      skip,
      limit,
    );

    return {
      total,
      page,
      limit,
      items,
    };
  }

  async getById(id: string) {
    const chapter = await this.chapterRepo.findById(id);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const content = await this.contentRepo.findByChapterId(id);

    return {
      chapter,
      content,
    };
  }

  async getBySlug(bookId: string, slug: string) {
    const chapter = await this.chapterRepo.findByBookAndSlug(bookId, slug);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const content = await this.contentRepo.findByChapterId(chapter.id);

    return {
      chapter,
      content,
    };
  }
}
