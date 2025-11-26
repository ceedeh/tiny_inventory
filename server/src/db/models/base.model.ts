export abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: { id?: string; createdAt?: Date; updatedAt?: Date }) {
    this.id = data.id!;
    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt!;
  }

  abstract toJSON(): Partial<this>;
}
