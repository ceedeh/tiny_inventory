import { Card } from "../ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryChartProps {
  data: Array<{ category: string; products: number }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Products by Category
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="products" fill="#1877f2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
