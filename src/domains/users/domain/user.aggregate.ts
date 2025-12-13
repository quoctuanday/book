export type UserRole = 'user' | 'author' | 'admin';

export class UserAggregate {
  private constructor(
    private _id: string | null,
    private _email: string,
    private _passwordHash: string,
    private _name?: string,
    private _avatarUrl?: string,
    private _isBanned = false,
    private _role: UserRole = 'user',
    private _createdAt?: Date,
    private _updatedAt?: Date,
  ) {}

  static createNew(params: {
    email: string;
    passwordHash: string;
    name?: string;
    avatarUrl?: string;
    role?: UserRole;
  }) {
    const now = new Date();
    return new UserAggregate(
      null,
      params.email,
      params.passwordHash,
      params.name,
      params.avatarUrl,
      false,
      params.role ?? 'user',
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    email: string;
    passwordHash: string;
    name?: string;
    avatarUrl?: string;
    isBanned?: boolean;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new UserAggregate(
      props.id,
      props.email,
      props.passwordHash,
      props.name,
      props.avatarUrl,
      !!props.isBanned,
      props.role ?? 'user',
      props.createdAt,
      props.updatedAt,
    );
  }

  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get name() {
    return this._name;
  }
  get avatarUrl() {
    return this._avatarUrl;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get isBanned() {
    return this._isBanned;
  }
  get role() {
    return this._role;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  changePassword(newHash: string) {
    if (!newHash) throw new Error('New password hash required');
    this._passwordHash = newHash;
    this.touch();
  }

  updateProfile(name?: string, avatarUrl?: string) {
    if (name !== undefined) this._name = name;
    if (avatarUrl !== undefined) this._avatarUrl = avatarUrl;
    this.touch();
  }

  ban() {
    this._isBanned = true;
    this.touch();
  }
  unban() {
    this._isBanned = false;
    this.touch();
  }
  promoteTo(role: UserRole) {
    this._role = role;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }

  toPersistence() {
    return {
      id: this._id,
      email: this._email,
      passwordHash: this._passwordHash,
      name: this._name,
      avatarUrl: this._avatarUrl,
      isBanned: this._isBanned,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toDTO() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      avatarUrl: this._avatarUrl,
      isBanned: this._isBanned,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
