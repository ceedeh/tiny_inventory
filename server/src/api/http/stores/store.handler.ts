import { Request, Response } from 'express';
import { StoreService } from '@/core/services';
import { Store } from '@/db';
import { BaseFilter } from '@/shared/types';

export class StoreHandler {
  constructor(private readonly storeService: StoreService) {
    this.createStore = this.createStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.getStoreById = this.getStoreById.bind(this);
    this.getStores = this.getStores.bind(this);
  }

  async createStore(req: Request, _: Response) {
    try {
      const store = await this.storeService.createStore(new Store(req.body));

      return store.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async updateStore(req: Request, _: Response) {
    try {
      const id = req.params.id;

      const store = await this.storeService.updateStore(id, req.body);
      return store!.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async deleteStore(req: Request, _: Response) {
    try {
      const id = req.params.id;
      await this.storeService.deleteStore(id);
    } catch (err) {
      throw err;
    }
  }

  async getStoreById(req: Request, _: Response) {
    try {
      const id = req.params.id;
      const store = await this.storeService.getStoreById(id);
      return store.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async getStores(req: Request, _: Response) {
    try {
      const stores = await this.storeService.getStores(req.query as unknown as BaseFilter);
      return {
        data: stores.data.map((store) => store.toJSON()),
        pagination: stores.pagination,
      };
    } catch (err) {
      throw err;
    }
  }
}
