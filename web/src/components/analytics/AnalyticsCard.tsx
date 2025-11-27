import { Card } from "../ui";

interface AnalyticsCardProps {
  title: string;
  value: number;
  subtitle?: string;
}

export function AnalyticsCard({ title, value, subtitle }: AnalyticsCardProps) {
  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-facebook-blue">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </Card>
  );
}
