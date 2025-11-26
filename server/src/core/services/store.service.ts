import { IStoreRepository, Store } from '@/db';
import { BadRequestException } from '@/shared/errors';
import { Logger } from '@/shared/logger';
import { BaseFilter } from '@/shared/types';

export class StoreService {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly logger: Logger
  ) {}

  async createStore(store: Store) {
    this.logger.info('Creating a new store', store);
    if (!store) {
      throw new BadRequestException('Store data is required');
    }

    const newStore = await this.storeRepository.create(store);
    return newStore;
  }

  async updateStore(id: string, update: Partial<Store>) {
    this.logger.info(`Updating store with id: ${id}`, update);

    if (!update) {
      throw new BadRequestException('Update data is required');
    }

    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new BadRequestException(`Store with id ${id} not found`);
    }

    const updatedStore = await this.storeRepository.update(id, update);
    return updatedStore;
  }

  async deleteStore(id: string) {
    this.logger.info(`Deleting store with id: ${id}`);
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new BadRequestException(`Store with id ${id} not found`);
    }

    await this.storeRepository.delete(id);
  }

  async getStoreById(id: string) {
    this.logger.info(`Fetching store with id: ${id}`);

    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new BadRequestException(`Store with id ${id} not found`);
    }
    return store;
  }

  async getStores(filter: BaseFilter) {
    this.logger.info('Fetching stores with filter', filter);

    return this.storeRepository.find(filter);
  }
}
