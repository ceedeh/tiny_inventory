import express from 'express';
import { StoreHandler } from './store.handler';
import { StoreService } from '@/core/services';
import { promisifyHandler } from '@/api/promisify_handler';
import { validateBody, validateQuery } from '@/shared/middleware';
import { updateStoreSchema, insertStoreSchema } from './store.schema';
import { paginationSchema } from '@/shared/schemas';

export class StoreRouter {
  public path = 'stores';
  private handler: StoreHandler;

  constructor(private readonly storeService: StoreService) {
    this.handler = new StoreHandler(this.storeService);
  }

  setup() {
    const r = express.Router();

    r.post('/', validateBody(insertStoreSchema), promisifyHandler(this.handler.createStore));
    r.put('/:id', validateBody(updateStoreSchema), promisifyHandler(this.handler.updateStore));
    r.delete('/:id', promisifyHandler(this.handler.deleteStore));
    r.get('/:id', promisifyHandler(this.handler.getStoreById));
    r.get('/', validateQuery(paginationSchema), promisifyHandler(this.handler.getStores));

    return r;
  }
}
