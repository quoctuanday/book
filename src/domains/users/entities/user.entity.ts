import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Book } from 'src/domains/books/entities/book.entity';
import { UserAggregate } from 'src/domains/users/domain/user.aggregate';

@Entity({ name: 'users' })
@Index('idx_users_email_unique', ['email'], { unique: true })
@Index('idx_users_role', ['role'])
@Index('idx_users_name', ['name'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ length: 100, nullable: true })
  name?: string;

  @Column({ name: 'avatar_url', length: 1000, nullable: true })
  avatarUrl?: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    name: 'is_banned',
  })
  isBanned: number;

  @Column({
    type: 'enum',
    enum: ['user', 'author', 'admin'],
    default: 'user',
  })
  role: 'user' | 'author' | 'admin';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  toAggregate(): UserAggregate {
    return UserAggregate.reconstitute({
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      name: this.name,
      avatarUrl: this.avatarUrl,
      isBanned: !!this.isBanned,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromAggregate(agg: UserAggregate): User {
    const e = new User();
    const p = agg.toPersistence();
    if (p.id) e.id = p.id;
    e.email = p.email;
    e.passwordHash = p.passwordHash;
    e.name = p.name;
    e.avatarUrl = p.avatarUrl;
    e.isBanned = p.isBanned ? 1 : 0;
    e.role = p.role;
    return e;
  }
}
