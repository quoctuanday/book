import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from 'src/domains/books/dto/create-book.dto';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Post()
  async create(@Req() req: any, @Body() dto: CreateBookDto) {
    const user = req.user as { sub: string };

    return this.booksService.create(user.sub, dto);
  }

  @Get()
  async findByIds(@Query('ids') id: string) {
    return this.booksService.findById(id);
  }
}
