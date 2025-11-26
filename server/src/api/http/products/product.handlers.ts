import { Request, Response } from 'express';
import { ProductService } from '@/core/services';
import { Product } from '@/db';
import { ProductFilter } from '@/shared/types';

export class ProductHandlers {
  constructor(private readonly productService: ProductService) {
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  async createProduct(req: Request, _: Response) {
    try {
      const product = await this.productService.createProduct(new Product(req.body));

      return product.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async updateProduct(req: Request, _: Response) {
    try {
      const id = req.params.id;

      const product = await this.productService.updateProduct(id, req.body);
      return product!.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(req: Request, _: Response) {
    try {
      const id = req.params.id;
      await this.productService.deleteProduct(id);
    } catch (err) {
      throw err;
    }
  }

  async getProductById(req: Request, _: Response) {
    try {
      const id = req.params.id;
      const product = await this.productService.getProductById(id);
      return product.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async getProducts(req: Request, _: Response) {
    try {
      const products = await this.productService.getProducts(req.query as unknown as ProductFilter);
      return {
        data: products.data.map((product) => product.toJSON()),
        pagination: products.pagination,
      };
    } catch (err) {
      throw err;
    }
  }
}
