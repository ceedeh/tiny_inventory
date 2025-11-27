import { Edit, Trash2 } from "lucide-react";
import { Card, Button } from "../ui";
import type { Store } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface StoreCardProps {
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
}

export function StoreCard({ store, onEdit, onDelete }: StoreCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => navigate(`/stores/${store.id}`)}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {store.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4">
          {store.description || "No description"}
        </p>
      </div>

      <div className="flex gap-2 mt-4 pt-4">
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(store);
          }}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit size={16} />
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this store?")) {
              onDelete(store.id);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </Card>
  );
}
