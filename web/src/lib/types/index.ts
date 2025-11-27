export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Store {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  storeId: string;
  description: string | null;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsStoreAnalytics {
  averageProductCount: number;
  productCount: number;
  storeCount: number;
}

export interface ProductsByCategory {
  category: string;
  products: number;
}
