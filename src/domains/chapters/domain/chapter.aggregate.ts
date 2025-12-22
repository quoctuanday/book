import { randomUUID } from 'crypto';

interface CreateChapterProps {
  bookId: string;
  number: number;
  title?: string;
}

export class ChapterAggregate {
  private constructor(
    public readonly id: string,
    public readonly bookId: string,
    public number: number,
    public slug: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public title?: string,
    public publishedAt?: Date,
  ) {}

  static createNew(props: CreateChapterProps): ChapterAggregate {
    if (props.number <= 0) {
      throw new Error('Chapter number must be greater than 0');
    }

    return new ChapterAggregate(
      randomUUID(),
      props.bookId,
      props.number,
      `chuong-${props.number}`,
      new Date(),
      new Date(),
      props.title?.trim(),
      undefined,
    );
  }

  static reconstitute(props: {
    id: string;
    bookId: string;
    number: number;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    publishedAt: Date;
  }) {
    return new ChapterAggregate(
      props.id,
      props.bookId,
      props.number,
      props.slug,
      props.createdAt,
      props.updatedAt,
      props.title,
      props.publishedAt,
    );
  }

  publish() {
    if (this.publishedAt) {
      throw new Error('Chapter already published');
    }
    this.publishedAt = new Date();
  }

  unpublish() {
    this.publishedAt = undefined;
  }

  rename(title?: string) {
    this.title = title?.trim();
  }
}
