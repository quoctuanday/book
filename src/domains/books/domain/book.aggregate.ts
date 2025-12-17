import { slugify } from 'src/common/utils/slugify';

export type BookStatus = 'draft' | 'ongoing' | 'completed' | 'hiatus';

export class BookAggregate {
  private constructor(
    private _id: string | null,
    private _title: string,
    private _slug: string,
    private _description?: string,
    private _coverUrl?: string,
    private _authorId?: string,
    private _status: BookStatus = 'draft',
    private _createdAt?: Date,
    private _updatedAt?: Date,
  ) {}

  static createNew(params: {
    title: string;
    description?: string;
    coverUrl?: string;
    authorId: string;
  }) {
    const now = new Date();
    const slug = slugify(params.title);

    return new BookAggregate(
      null,
      params.title,
      slug,
      params.description,
      params.coverUrl,
      params.authorId,
      'draft',
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    coverUrl?: string;
    authorId?: string;
    status: BookStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new BookAggregate(
      props.id,
      props.title,
      props.slug,
      props.description,
      props.coverUrl,
      props.authorId,
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get slug() {
    return this._slug;
  }

  get status() {
    return this._status;
  }

  get authorId() {
    return this._authorId;
  }

  updateInfo(params: {
    title?: string;
    description?: string;
    coverUrl?: string;
  }) {
    if (params.title !== undefined) {
      this._title = params.title;
      this._slug = slugify(params.title);
    }

    if (params.description !== undefined) {
      this._description = params.description;
    }

    if (params.coverUrl !== undefined) {
      this._coverUrl = params.coverUrl;
    }

    this.touch();
  }

  start() {
    if (this._status !== 'draft') return;
    this._status = 'ongoing';
    this.touch();
  }

  complete() {
    if (this._status !== 'ongoing') {
      throw new Error('Only ongoing book can be completed');
    }
    this._status = 'completed';
    this.touch();
  }

  pause() {
    if (this._status !== 'ongoing') {
      throw new Error('Only ongoing book can be paused');
    }
    this._status = 'hiatus';
    this.touch();
  }

  resume() {
    if (this._status !== 'hiatus') {
      throw new Error('Only hiatus book can be resumed');
    }
    this._status = 'ongoing';
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }

  toPersistence() {
    return {
      id: this._id,
      title: this._title,
      slug: this._slug,
      description: this._description,
      coverUrl: this._coverUrl,
      authorId: this._authorId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toDTO() {
    return {
      id: this._id,
      title: this._title,
      slug: this._slug,
      description: this._description,
      coverUrl: this._coverUrl,
      authorId: this._authorId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
