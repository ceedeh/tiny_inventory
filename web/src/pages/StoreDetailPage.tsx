import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import {
  useStore,
  useProducts,
  useDeleteProduct,
  useProductsByCategoryForStore,
} from "@/lib/queries";
import type { Product } from "@/lib/types";

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const { data: store, isLoading: storeLoading } = useStore(id!);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    storeId: id,
    limit: 100,
  });
  const { data: categoryData, isLoading: categoryLoading } =
    useProductsByCategoryForStore(id!);
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-facebook-gray flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-facebook-gray flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Store not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-facebook-gray">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-facebook-blue hover:text-facebook-darkBlue mb-2 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Stores
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          {store.description && (
            <p className="text-gray-600 mt-1">{store.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!categoryLoading && categoryData && categoryData.length > 0 && (
          <div className="mb-8">
            <CategoryChart data={categoryData} />
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        {productsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : productsData?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No products yet. Add your first product!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        storeId={id!}
        product={selectedProduct}
      />
    </div>
  );
}
