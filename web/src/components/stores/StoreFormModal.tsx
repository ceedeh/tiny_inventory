import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Textarea, Button } from "../ui";
import { useCreateStore, useUpdateStore } from "@/lib/queries";
import type { Store } from "@/lib/types";
import { useEffect } from "react";

const storeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  store?: Store;
}

export function StoreFormModal({
  isOpen,
  onClose,
  store,
}: StoreFormModalProps) {
  const isEdit = !!store;
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        description: store.description || "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [store, reset]);

  const onSubmit = async (data: StoreFormData) => {
    try {
      if (isEdit) {
        await updateStore.mutateAsync({ id: store.id, data });
      } else {
        await createStore.mutateAsync(data);
      }
      reset();
      onClose();
    } catch (error) {
      alert("Failed to save store.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Store" : "Create Store"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Store Name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Enter store name"
        />

        <Textarea
          label="Description (Optional)"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Enter store description"
          rows={4}
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={createStore.isPending || updateStore.isPending}
            variant="primary"
          >
            {createStore.isPending || updateStore.isPending
              ? "Saving..."
              : isEdit
              ? "Update Store"
              : "Create Store"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
