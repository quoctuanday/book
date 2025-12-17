export type BookStatus = 'draft' | 'ongoing' | 'completed' | 'hiatus';

export class BookAggregate {
  private constructor(
    private _id: string | null,
    private _title: string,
    private _description?: string,
    private _coverImage?: string,
    private _authorId?: string,
    private _status: BookStatus = 'draft',
    private _createdAt?: Date,
    private _updatedAt?: Date,
  ) {}

  static createNew(params: {
    title: string;
    description?: string;
    coverImage?: string;
    authorId: string;
  }) {
    const now = new Date();

    return new BookAggregate(
      null,
      params.title,
      params.description,
      params.coverImage,
      params.authorId,
      'draft',
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    authorId?: string;
    status: BookStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new BookAggregate(
      props.id,
      props.title,
      props.description,
      props.coverImage,
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

  get status() {
    return this._status;
  }

  get authorId() {
    return this._authorId;
  }

  updateInfo(params: {
    title?: string;
    description?: string;
    coverImage?: string;
  }) {
    if (params.title !== undefined) this._title = params.title;
    if (params.description !== undefined)
      this._description = params.description;
    if (params.coverImage !== undefined) this._coverImage = params.coverImage;

    this.touch();
  }

  start() {
    if (this._status !== 'draft') return;
    this._status = 'ongoing';
    this.touch();
  }

  complete() {
    if (this._status !== 'ongoing')
      throw new Error('Only ongoing book can be completed');

    this._status = 'completed';
    this.touch();
  }

  pause() {
    if (this._status !== 'ongoing')
      throw new Error('Only ongoing book can be paused');

    this._status = 'hiatus';
    this.touch();
  }

  resume() {
    if (this._status !== 'hiatus')
      throw new Error('Only hiatus book can be resumed');

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
      description: this._description,
      coverImage: this._coverImage,
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
      description: this._description,
      coverImage: this._coverImage,
      authorId: this._authorId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
