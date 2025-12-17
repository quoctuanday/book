import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { GenreAggregate } from '../domain/genre.aggregate';
import { IGenreRepository } from '../domain/genre.repository.interface';

@Injectable()
export class GenreTypeOrmRepository implements IGenreRepository {
  constructor(
    @InjectRepository(Genre)
    private readonly repo: Repository<Genre>,
  ) {}

  async save(genre: GenreAggregate): Promise<GenreAggregate> {
    const persistence = genre.toPersistence();

    const entity = this.repo.create({
      id: persistence.id ?? undefined,
      name: persistence.name,
      slug: persistence.slug,
      status: persistence.status,
    });

    const saved = await this.repo.save(entity);

    return this.toAggregate(saved);
  }

  async findById(id: string): Promise<GenreAggregate | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toAggregate(entity) : null;
  }

  async findBySlug(slug: string): Promise<GenreAggregate | null> {
    const entity = await this.repo.findOne({ where: { slug } });
    return entity ? this.toAggregate(entity) : null;
  }

  async findAll(): Promise<GenreAggregate[]> {
    const entities = await this.repo.find({
      where: { status: 'active' },
      order: { name: 'ASC' },
    });

    return entities.map((e) => this.toAggregate(e));
  }

  async findByIds(ids: string[]): Promise<GenreAggregate[]> {
    if (!ids.length) return [];

    const entities = await this.repo.find({
      where: { id: In(ids) },
    });

    return entities.map((e) => this.toAggregate(e));
  }

  private toAggregate(entity: Genre): GenreAggregate {
    return GenreAggregate.reconstitute({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      status: entity.status as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
