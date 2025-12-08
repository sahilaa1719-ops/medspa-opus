import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'valid' | 'expiring' | 'expired';
  children: React.ReactNode;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800 font-semibold',
  inactive: 'bg-gray-100 text-gray-800 font-semibold',
  valid: 'bg-green-100 text-green-800 font-semibold',
  expiring: 'bg-amber-100 text-amber-800 font-semibold',
  expired: 'bg-red-100 text-red-800 font-semibold',
};

export const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {children}
    </span>
  );
};
