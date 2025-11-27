import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Textarea, Button } from "../ui";
import { useCreateProduct, useUpdateProduct } from "@/lib/queries";
import type { Product } from "@/lib/types";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sku: z.string().min(1, "SKU is required").max(50),
  category: z.string().min(1, "Category is required").max(100),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  storeId: z.uuid("Invalid store ID"),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  product?: Product;
}

export function ProductFormModal({
  isOpen,
  onClose,
  storeId,
  product,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      storeId,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        storeId: product.storeId,
        description: product.description || "",
      });
    } else {
      reset({
        name: "",
        sku: "",
        category: "",
        price: 0,
        quantity: 0,
        storeId,
        description: "",
      });
    }
  }, [product, storeId, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: product.id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Product" : "Create Product"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Product Name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Enter product name"
        />

        <Input
          label="SKU"
          {...register("sku")}
          error={errors.sku?.message}
          placeholder="Enter product SKU"
        />

        <Input
          label="Category"
          {...register("category")}
          error={errors.category?.message}
          placeholder="e.g., electronics, books"
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
          placeholder="0.00"
        />

        <Input
          label="Quantity"
          type="number"
          {...register("quantity", { valueAsNumber: true })}
          error={errors.quantity?.message}
          placeholder="0"
        />

        <Textarea
          label="Description (Optional)"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Enter product description"
          rows={4}
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={createProduct.isPending || updateProduct.isPending}
          >
            {createProduct.isPending || updateProduct.isPending
              ? "Saving..."
              : isEdit
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
