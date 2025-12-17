import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from 'src/domains/genre/dto/create-genre.dto';

@Controller('api/genre')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  @Get()
  async findByIds(@Query('ids') ids: string) {
    return this.genresService.findListByIds(ids.split(','));
  }
}
