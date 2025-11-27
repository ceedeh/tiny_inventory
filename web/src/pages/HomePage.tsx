import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, Pagination } from "@/components/ui";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreFormModal } from "@/components/stores/StoreFormModal";
import { AnalyticsCard } from "@/components/analytics/AnalyticsCard";
import { useStores, useDeleteStore, useProductsByStore } from "@/lib/queries";
import type { Store } from "@/lib/types";

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 6;

  const { data: storesResponse, isLoading: storesLoading } = useStores(
    currentPage,
    itemsPerPage
  );
  const { data: analyticsData, isLoading: analyticsLoading } =
    useProductsByStore();
  const deleteStore = useDeleteStore();

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedStore(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(undefined);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete store:", error);
    }
  };

  return (
    <div className="min-h-screen bg-facebook-gray">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tiny Inventory</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Total Stores"
              value={analyticsData?.storeCount || 0}
              subtitle="Active stores"
            />
            <AnalyticsCard
              title="Total Products"
              value={analyticsData?.productCount || 0}
              subtitle="Across all stores"
            />
            <AnalyticsCard
              title="Average Products"
              value={analyticsData?.averageProductCount || 0}
              subtitle="Per store"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Stores</h2>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={20} />
            Create Store
          </Button>
        </div>

        {storesLoading || analyticsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : storesResponse?.data?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No stores yet. Create your first store!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {storesResponse?.data?.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {storesResponse?.pagination && (
              <Pagination
                currentPage={storesResponse.pagination.page}
                totalPages={storesResponse.pagination.totalPages}
                totalItems={storesResponse.pagination.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <StoreFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        store={selectedStore}
      />
    </div>
  );
}
