import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('book_genres')
@Index(['bookId', 'genreId'], { unique: true })
export class BookGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookId: string;

  @Column({ type: 'uuid' })
  genreId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
