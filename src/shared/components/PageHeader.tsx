import type { ReactNode } from 'react';

import type { PageSectionLink } from '@/shared/components/PageSectionNav';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  sections?: PageSectionLink[];
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="page-header-shell">
      <div className="page-header-main">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-xl">{title}</h1>
          {description && <p className="page-header-description">{description}</p>}
        </div>

        {action && <div className="page-header-actions">{action}</div>}
      </div>
    </header>
  );
}
