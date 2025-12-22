import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Book } from '../books/entities/book.entity';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { ChapterTypeOrmRepository } from 'src/domains/chapters/entities/chapter.typeorm.repository';
import { ChapterContentTypeOrmRepository } from 'src/domains/chapters/entities/chapter-content.typeorm.repository';
import { ChapterContent } from 'src/domains/chapters/entities/chapter-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, ChapterContent, Book])],
  controllers: [ChaptersController],
  providers: [
    ChaptersService,
    {
      provide: 'CHAPTER_REPO',
      useClass: ChapterTypeOrmRepository,
    },
    {
      provide: 'CHAPTER_CONTENT_REPO',
      useClass: ChapterContentTypeOrmRepository,
    },
  ],
  exports: [ChaptersService],
})
export class ChaptersModule {}
