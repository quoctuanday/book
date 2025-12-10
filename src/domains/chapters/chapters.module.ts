import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Book } from '../books/entities/book.entity';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Book])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
