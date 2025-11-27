import { Edit, Trash2 } from "lucide-react";
import { Card, Button } from "../ui";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const isLowStock = product.quantity < 10;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.sku}</p>
        </div>
        {isLowStock && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Low Stock
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description || "No description"}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Category:</span>
          <p className="font-medium text-gray-900 capitalize">
            {product.category}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Price:</span>
          <p className="font-medium text-facebook-blue">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Stock:</span>
          <p
            className={`font-medium ${
              isLowStock ? "text-red-600" : "text-gray-900"
            }`}
          >
            {product.quantity}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-300">
        <Button
          variant="secondary"
          onClick={() => onEdit(product)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Edit size={16} />
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Are you sure you want to delete this product?")) {
              onDelete(product.id);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </Card>
  );
}
