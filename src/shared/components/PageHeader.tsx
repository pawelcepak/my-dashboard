import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">{title}</h1>

        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-5 text-zinc-500">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
