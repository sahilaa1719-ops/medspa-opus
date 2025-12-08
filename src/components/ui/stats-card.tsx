import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const StatsCard = ({ title, value, icon: Icon }: StatsCardProps) => {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon className="h-6 w-6 text-[#6B7280]" />
        </div>
      </div>
    </div>
  );
};
