import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { IBookRepository } from '../domain/book.repository.interface';
import { BookAggregate } from '../domain/book.aggregate';

@Injectable()
export class BookTypeOrmRepository implements IBookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly repo: Repository<Book>,
  ) {}

  async save(aggregate: BookAggregate): Promise<BookAggregate> {
    const persistence = aggregate.toPersistence();

    const entity = this.repo.create({
      id: persistence.id ?? undefined,
      title: persistence.title,
      slug: persistence.slug,
      description: persistence.description,
      coverUrl: persistence.coverUrl,
      authorId: persistence.authorId,
      status: persistence.status,
    });

    const saved = await this.repo.save(entity);

    return BookAggregate.reconstitute({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      coverUrl: saved.coverUrl,
      slug: saved.slug,
      authorId: saved.authorId,
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findById(id: string): Promise<BookAggregate | null> {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) return null;

    return BookAggregate.reconstitute({
      id: book.id,
      title: book.title,
      description: book.description,
      slug: book.slug,
      coverUrl: book.coverUrl,
      authorId: book.authorId,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  }
}
