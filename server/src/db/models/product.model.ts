import { BaseModel } from './base.model';
import { Product as ProductTable, Store as StoreTable } from '@/db/tables';
import { Store } from './store.model';

export class Product extends BaseModel {
  name: string;
  category: string;
  price: number;
  quantity: number;
  storeId: string;
  sku: string;
  description: string | null;
  store?: Store;

  constructor(data: Partial<ProductTable> & { store?: StoreTable }) {
    super(data);
    this.name = data.name!;
    this.category = data.category!;
    this.price = data.price!;
    this.quantity = data.quantity!;
    this.storeId = data.storeId!;
    this.description = data.description!;
    this.sku = data.sku!;
    this.store = new Store(data.store || {});
  }

  toJSON(): Partial<this> {
    const data = {
      id: this.id,
      sku: this.sku,
      name: this.name,
      category: this.category,
      price: parseFloat((this.price / 100).toFixed(2)),
      quantity: this.quantity,
      storeId: this.storeId,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Partial<this>;

    if (this.store) {
      data.store = this.store.toJSON() as Store;
    }

    return data;
  }
}
