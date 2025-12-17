import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity({ name: 'genres' })
@Index('idx_genre_name', ['name'], { unique: true })
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 120, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: ['active', 'disabled'],
    default: 'active',
  })
  status: 'active' | 'disabled';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Book, (book) => book.genres)
  books: Book[];
}
