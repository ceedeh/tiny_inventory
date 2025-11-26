import request from 'supertest';
import { setupApp } from './setup';
import { Store, Product } from '@/db/models';
import { Application } from 'express';
import { ProductsRepositoryMock } from './__mocks__/repositories/products.repository';
import { StoreRepositoryMock } from './__mocks__/repositories/store.repositories';
import { faker } from '@faker-js/faker';
import { IResponse } from '@/shared/types';

describe('Product API endpoints', () => {
  let app: Application;
  let productRepository: ProductsRepositoryMock;
  let storeRepository: StoreRepositoryMock;
  let store: Store;

  beforeAll(async () => {
    const setup = setupApp();
    app = setup.app;
    productRepository = setup.productRepository;
    storeRepository = setup.storeRepository;

    store = await storeRepository.create(
      new Store({
        name: 'Test Store',
        description: 'A test store',
        id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  afterAll(() => {
    storeRepository.clear();
    productRepository.clear();
  });

  describe('Create/Update/Delete endpoints', () => {
    let product: Product;

    test('POST /products creates a product', async () => {
      const productData = {
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: parseInt(faker.commerce.price()),
        quantity: faker.number.int({ min: 1, max: 100 }),
        sku: faker.string.alphanumeric(8),
        storeId: store.id,
      };

      const res = await request(app).post('/api/v1/products').send(productData);

      const body: IResponse<Product> = res.body;

      product = body.data!;

      expect(res.status).toBe(200);
      expect(body.success).toBeTruthy();
      expect(body.message).toBe('OK');
      expect(product.name).toBe(productData.name);
      expect(product.storeId).toBe(store.id);
      expect(product.sku).toBe(productData.sku.toLowerCase());
      expect(product.category).toBe(productData.category.toLowerCase());
      expect(product.price).toBe(productData.price);
      expect(product.quantity).toBe(productData.quantity);
    });

    test('PUT /products/:id updates a product', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${product.id}`)
        .send({ name: 'Updated Name' });

      const body: IResponse<Product> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.name).toBe('Updated Name');

      product.name = body.data!.name;
    });

    test('POST /products fails with duplicate sku', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({
          name: faker.commerce.productName(),
          category: faker.commerce.department(),
          price: parseInt(faker.commerce.price()),
          quantity: faker.number.int({ min: 1, max: 100 }),
          sku: product.sku,
          storeId: store.id,
        });

      const body: IResponse<null> = res.body;

      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Product with this SKU already exists');
    });

    test('DELETE /products/:id deletes a product', async () => {
      const res = await request(app).delete(`/api/v1/products/${product.id}`);
      expect(res.status).toBe(200);

      const getResponse = await request(app).get(`/products/${product.id}`);
      expect(getResponse.status).toBe(404);
    });

    test('POST /products fails with invalid store', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({
          name: faker.commerce.productName(),
          category: faker.commerce.department(),
          price: parseInt(faker.commerce.price()),
          quantity: faker.number.int({ min: 1, max: 100 }),
          sku: faker.string.alphanumeric(8),
          storeId: '00000000-0000-0000-0000-000000000000',
        });

      const body: IResponse<null> = res.body;

      expect(res.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Store does not exist');
    });
  });

  describe('GET endpoints with seeded data', () => {
    let product: Product;

    beforeAll(async () => {
      // Seed 25 products
      for (let i = 1; i <= 25; i++) {
        await productRepository.create(
          new Product({
            name: faker.commerce.productName(),
            price: parseInt(faker.commerce.price()),
            quantity: faker.number.int({ min: 1, max: 100 }),
            sku: faker.string.alphanumeric(8),
            storeId: store.id,
            category: i % 2 === 0 ? 'electronics' : 'books',
          })
        );
      }
    });

    test('GET /products returns paginated products', async () => {
      const res = await request(app).get('/api/v1/products?page=1&limit=10');
      const body: IResponse<Product[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data).toBeDefined();
      expect(body.data!.length).toBe(10);
      expect(body.data!.length).toBe(10);
      expect(body.pagination!.total).toBe(25);
      expect(body.pagination!.totalPages).toBe(3);
      expect(body.pagination!.page).toBe(1);
      expect(body.pagination!.limit).toBe(10);

      product = body.data![0];
    });

    test('GET /products filters by category', async () => {
      const res = await request(app).get('/api/v1/products?category=electronics&page=1&limit=25');
      const body: IResponse<Product[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.every((p: any) => p.category === 'electronics')).toBe(true);
    });

    test('Get /products filters by storeId', async () => {
      const res = await request(app).get(`/api/v1/products?storeId=${store.id}&page=1&limit=25`);
      const body: IResponse<Product[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.every((p: any) => p.storeId === store.id)).toBe(true);
    });

    test('GET /products filters by price range', async () => {
      const res = await request(app).get(
        '/api/v1/products?minPrice=20&maxPrice=50&page=1&limit=25'
      );
      const body: IResponse<Product[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.every((p: any) => p.price >= 20 && p.price <= 50)).toBeTruthy();
    });

    test('GET /products filters by stock range', async () => {
      const res = await request(app).get(
        '/api/v1/products?minStock=10&maxStock=50&page=1&limit=25'
      );
      const body: IResponse<Product[]> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.every((p: any) => p.quantity >= 10 && p.quantity <= 50)).toBeTruthy();
    });

    test('GET /products/:id returns product with store', async () => {
      const res = await request(app).get(`/api/v1/products/${product.id}`);
      const body: IResponse<Product> = res.body;

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('OK');
      expect(body.data!.id).toBe(product.id);
      expect(body.data!.store).toBeDefined();
      expect(body.data!.store!.id).toBe(store.id);
    });
  });
});
