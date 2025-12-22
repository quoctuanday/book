import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ListChaptersQuery } from './dto/get-list.dto';

@Controller('api/chapters')
export class ChaptersController {
  constructor(private readonly service: ChaptersService) {}

  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChapterDto) {
    return this.service.update(id, dto);
  }

  @Get('book/:bookId')
  list(@Param('bookId') bookId: string, @Query() q: ListChaptersQuery) {
    return this.service.listByBook(bookId, q.page, q.limit);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('book/:bookId/:slug')
  getBySlug(@Param('bookId') bookId: string, @Param('slug') slug: string) {
    return this.service.getBySlug(bookId, slug);
  }
}
