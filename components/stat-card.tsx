'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/20',
  success: 'bg-[oklch(0.70_0.18_155/0.1)] border-[oklch(0.70_0.18_155/0.2)]',
  warning: 'bg-[oklch(0.80_0.15_85/0.1)] border-[oklch(0.80_0.15_85/0.2)]',
  destructive: 'bg-destructive/10 border-destructive/20',
};

const iconVariantStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-[oklch(0.70_0.18_155)]',
  warning: 'text-[oklch(0.80_0.15_85)]',
  destructive: 'text-destructive',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all hover:shadow-lg',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center bg-secondary/50',
          )}
        >
          <Icon className={cn('h-6 w-6', iconVariantStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
