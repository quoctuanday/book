import { Body, Controller, Post } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from 'src/domains/genre/dto/create-genre.dto';

@Controller('api/genre')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }
}
