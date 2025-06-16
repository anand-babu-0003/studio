import type React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("py-12 md:py-16 text-center", className)}>
      <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
