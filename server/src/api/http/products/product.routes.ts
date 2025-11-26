import express from 'express';
import { ProductService } from '@/core/services';
import { ProductHandlers } from './product.handlers';
import { validateBody, validateQuery } from '@/shared/middleware';
import { promisifyHandler } from '@/api/promisify_handler';
import { productFilterSchema, updateProductSchema, insertProductSchema } from './product.schema';

export class ProductRouter {
  public path = 'products';
  private handler: ProductHandlers;

  constructor(private readonly productService: ProductService) {
    this.handler = new ProductHandlers(this.productService);
  }

  setup() {
    const r = express.Router();

    r.post('/', validateBody(insertProductSchema), promisifyHandler(this.handler.createProduct));
    r.put('/:id', validateBody(updateProductSchema), promisifyHandler(this.handler.updateProduct));
    r.delete('/:id', promisifyHandler(this.handler.deleteProduct));
    r.get('/:id', promisifyHandler(this.handler.getProductById));
    r.get('/', validateQuery(productFilterSchema), promisifyHandler(this.handler.getProducts));

    return r;
  }
}
