import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'books' })
@Index('idx_books_slug', ['slug'], { unique: true })
@Index('idx_books_title', ['title'])
@Index('idx_books_author_id', ['authorId'])
@Index('idx_books_status', ['status'])
@Index('idx_books_created_at', ['createdAt'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description?: string;

  @Column({ name: 'cover_url', length: 1000, nullable: true })
  coverUrl?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'ongoing', 'completed', 'hiatus'],
    default: 'draft',
  })
  status: 'draft' | 'ongoing' | 'completed' | 'hiatus';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'author_id', type: 'char', length: 36, nullable: true })
  authorId?: string;
}
