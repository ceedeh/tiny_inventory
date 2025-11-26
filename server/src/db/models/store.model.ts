import { BaseModel } from './base.model';
import { Store as StoreTable } from '@/db/tables';

export class Store extends BaseModel {
  name: string;
  description: string | null;

  constructor(data: Partial<StoreTable>) {
    super(data);

    this.name = data.name!;
    this.description = data.description!;
  }

  toJSON(): Partial<this> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Partial<this>;
  }
}
