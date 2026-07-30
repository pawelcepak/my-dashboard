import { createPortal } from 'react-dom';
import { useEffect, useState, type ReactNode } from 'react';

import PageSectionNav, { type PageSectionLink } from '@/shared/components/PageSectionNav';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  sections?: PageSectionLink[];
};

export default function PageHeader({ title, description, action, sections }: PageHeaderProps) {
  const [navigationSlot, setNavigationSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setNavigationSlot(document.getElementById('page-section-nav-slot'));
  }, []);

  return (
    <>
      <header className="page-header-shell">
        <div className="page-header-main">
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-xl">{title}</h1>
            {description && <p className="page-header-description">{description}</p>}
          </div>

          {action && <div className="page-header-actions">{action}</div>}
        </div>
      </header>

      {navigationSlot && sections && sections.length > 0
        ? createPortal(<PageSectionNav sections={sections} />, navigationSlot)
        : null}
    </>
  );
}
