import axios from "axios";
import type {
  IResponse,
  Product,
  ProductsByCategory,
  ProductsStoreAnalytics,
  Store,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const storeApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await apiClient.get<IResponse<Store[]>>(`/stores`, {
      params: { page, limit },
    });

    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<IResponse<Store>>(`/stores/${id}`);
    return res.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const res = await apiClient.post<IResponse<Store>>("/stores", data);
    return res.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const res = await apiClient.put<IResponse<Store>>(`/stores/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<IResponse<Store>>(`/stores/${id}`);
    return res.data;
  },
};

export const productApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    storeId?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
  }) => {
    const res = await apiClient.get<IResponse<Product[]>>("/products", {
      params,
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<IResponse<Product>>(`/products/${id}`);
    return res.data;
  },

  create: async (data: {
    name: string;
    sku: string;
    category: string;
    price: number;
    quantity: number;
    storeId: string;
    description?: string;
  }) => {
    const res = await apiClient.post<IResponse<Product>>("/products", data);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<{
      name: string;
      sku: string;
      category: string;
      price: number;
      quantity: number;
      storeId: string;
      description: string;
    }>
  ) => {
    const res = await apiClient.put<IResponse<Product>>(
      `/products/${id}`,
      data
    );
    return res.data;
  },

  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const analyticsApi = {
  productsStores: async () => {
    const res = await apiClient.get<IResponse<ProductsStoreAnalytics>>(
      "/analytics/products-stores"
    );
    return res.data;
  },

  getProductsByCategoryForStore: async (storeId: string) => {
    const res = await apiClient.get<IResponse<ProductsByCategory[]>>(
      `/analytics/stores/${storeId}/products-by-category`
    );
    return res.data;
  },
};
