import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity({ name: 'chapters' })
@Index('idx_chapter_slug', ['slug'])
@Index('idx_chapters_published_at', ['publishedAt'])
@Index('uq_chapters_book_number', ['bookId', 'number'], { unique: true })
@Index('uq_chapters_book_slug', ['bookId', 'slug'], { unique: true })
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'book_id', type: 'char', length: 36 })
  bookId: string;

  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'decimal', precision: 8, scale: 3 })
  number: number;

  @Column({ length: 255 })
  slug: string;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
