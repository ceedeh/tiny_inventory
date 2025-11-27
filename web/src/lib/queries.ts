import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeApi, productApi, analyticsApi } from "./api";

export const useStores = (page = 1, limit = 100) =>
  useQuery({
    queryKey: ["stores", page, limit],
    queryFn: async () => {
      const response = await storeApi.getAll(page, limit);
      return response;
    },
  });

export const useStore = (id: string) =>
  useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const { data } = await storeApi.getById(id);
      return data;
    },
    enabled: !!id,
  });

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string };
    }) => storeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useProducts = (params: {
  page?: number;
  limit?: number;
  storeId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await productApi.getAll(params);
      return response;
    },
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await productApi.getById(id);
      return data;
    },
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useProductsByStore = () =>
  useQuery({
    queryKey: ["analytics", "products-stores"],
    queryFn: async () => {
      const { data } = await analyticsApi.productsStores();
      return data;
    },
  });

export const useProductsByCategoryForStore = (storeId: string) =>
  useQuery({
    queryKey: ["analytics", "products-by-category", storeId],
    queryFn: async () => {
      const { data } = await analyticsApi.getProductsByCategoryForStore(
        storeId
      );
      return data;
    },
    enabled: !!storeId,
  });
