import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { slugify } from 'src/common/utils/slugify';
import { GenreAggregate } from 'src/domains/genre/domain/genre.aggregate';
import { IGenreRepository } from 'src/domains/genre/domain/genre.repository.interface';
import { CreateGenreDto } from 'src/domains/genre/dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @Inject('GENRE_REPO')
    private readonly genreRepo: IGenreRepository,
  ) {}

  async create(dto: CreateGenreDto) {
    const slug = slugify(dto.name);
    const existed = await this.genreRepo.findBySlug(slug);
    if (existed) {
      throw new BadRequestException('Genre slug already exists');
    }

    const genre = GenreAggregate.createNew({
      name: dto.name,
      slug: slug,
    });

    const saved = await this.genreRepo.save(genre);

    return saved.toDTO();
  }
}
