import request from 'supertest';
import { setupApp } from './setup';
import { Store } from '@/db/models';
import { Application } from 'express';
import { StoreRepositoryMock } from './__mocks__/repositories';
import { faker } from '@faker-js/faker';
import { IResponse } from '@/shared/types';

describe('Store API endpoints', () => {
  let app: Application;
  let storeRepository: StoreRepositoryMock;

  beforeAll(async () => {
    const setup = setupApp();
    app = setup.app;
    storeRepository = setup.storeRepository;
  });

  afterAll(() => {
    storeRepository.clear();
  });

  describe('Create/Update/Delete endpoints', () => {
    let store: Store;

    test('POST /stores creates a store', async () => {
      const storeData = {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      };

      const res = await request(app).post('/api/v1/stores').send(storeData);
      const body: IResponse<Store> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBeTruthy();
      expect(body.message).toBe('OK');
      expect(body.data!.name).toBe(storeData.name);
      expect(body.data!.description).toBe(storeData.description);
      expect(body.data!.id).toBeDefined();
      expect(body.data!.createdAt).toBeDefined();

      store = body.data!;
    });

    test('POST /stores fails with missing name', async () => {
      const res = await request(app).post('/api/v1/stores').send({ description: 'Test' });
      const body: IResponse<Store> = res.body;

      expect(res.status).toBe(400);
      expect(body.success).toBeFalsy();
      expect(body.message).toBe('Validation error');
    });

    test('PUT /stores/:id updates a store', async () => {
      const updatedData = {
        name: 'Updated Store Name',
        description: 'Updated description',
      };

      const res = await request(app).put(`/api/v1/stores/${store.id}`).send(updatedData);
      const body: IResponse<Store> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBeTruthy();
      expect(body.message).toBe('OK');
      expect(body.data!.name).toBe(updatedData.name);
      expect(body.data!.description).toBe(updatedData.description);

      store.name = updatedData.name;
      store.description = updatedData.description;
    });

    test('DELETE /stores/:id deletes a store', async () => {
      const res = await request(app).delete(`/api/v1/stores/${store.id}`);
      const body: IResponse<null> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBeTruthy();
      expect(body.message).toBe('OK');

      const getResponse = await request(app).get(`/api/v1/stores/${store.id}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('GET endpoints with seeded data', () => {
    beforeAll(async () => {
      for (let i = 1; i <= 15; i++) {
        await storeRepository.create(
          new Store({
            name: `${faker.company.name()} ${i}`,
            description: faker.company.catchPhrase(),
            id: faker.string.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
      }
    });

    test('GET /stores returns paginated stores', async () => {
      const res = await request(app).get('/api/v1/stores?page=1&limit=10');
      const body: IResponse<Store[]> = res.body;

      expect(res.status).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data!.length).toBe(10);
      expect(body.pagination).toBeDefined();
      expect(body.pagination!.page).toBe(1);
      expect(body.pagination!.limit).toBe(10);
      expect(body.pagination!.total).toBeGreaterThanOrEqual(15);
    });

    test('GET /stores with page 2', async () => {
      const res = await request(app).get('/api/v1/stores?page=2&limit=10');
      const body: IResponse<Store[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.data!.length).toBeGreaterThan(0);
      expect(body.pagination!.page).toBe(2);
    });

    test('GET /stores/:id returns store by id', async () => {
      const stores = await storeRepository.find({ page: 1, limit: 1 });
      const store = stores.data[0];

      const res = await request(app).get(`/api/v1/stores/${store.id}`);
      const body: IResponse<Store> = res.body;

      expect(res.status).toBe(200);
      expect(body.data!.id).toBe(store.id);
      expect(body.data!.name).toBe(store.name);
      expect(body.data!.description).toBe(store.description);
    });
  });
});
