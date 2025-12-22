import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'chapter_contents' })
@Index('uq_chapter_content_chapter', ['chapterId'], { unique: true })
export class ChapterContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chapter_id', type: 'char', length: 36 })
  chapterId: string;

  @Column({ type: 'longtext' })
  content: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
