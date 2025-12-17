export type GenreStatus = 'active' | 'disabled';

export class GenreAggregate {
  private constructor(
    private _id: string | null,
    private _name: string,
    private _slug: string,
    private _status: GenreStatus = 'active',
    private _createdAt?: Date,
    private _updatedAt?: Date,
  ) {}

  static createNew(params: {
    name: string;
    slug: string;
    description?: string;
  }) {
    const now = new Date();

    return new GenreAggregate(
      null,
      params.name,
      params.slug,
      'active',
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    name: string;
    slug: string;
    status: GenreStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new GenreAggregate(
      props.id,
      props.name,
      props.slug,
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get slug() {
    return this._slug;
  }

  get status() {
    return this._status;
  }

  updateInfo(params: { name?: string; slug?: string; description?: string }) {
    if (params.name !== undefined) this._name = params.name;
    if (params.slug !== undefined) this._slug = params.slug;

    this.touch();
  }

  disable() {
    this._status = 'disabled';
    this.touch();
  }

  activate() {
    this._status = 'active';
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }

  toPersistence() {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toDTO() {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
