import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';

type CollapsiblePanelProps = {
  storageKey: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  summary?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const STORAGE_PREFIX = 'chb:panel-state:';

function readInitialState(storageKey: string, defaultOpen: boolean): boolean {
  if (typeof window === 'undefined') {
    return defaultOpen;
  }

  const storedValue = window.localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);

  if (storedValue === 'open') {
    return true;
  }

  if (storedValue === 'closed') {
    return false;
  }

  return defaultOpen;
}

export default function CollapsiblePanel({
  storageKey,
  title,
  description,
  icon,
  summary,
  defaultOpen = false,
  children,
  className = '',
  contentClassName = '',
}: CollapsiblePanelProps) {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(() => readInitialState(storageKey, defaultOpen));

  useEffect(() => {
    window.localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, isOpen ? 'open' : 'closed');
  }, [isOpen, storageKey]);

  return (
    <section className={`app-panel overflow-hidden ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--app-accent)]"
      >
        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>

          {description && <p className="mt-0.5 truncate text-xs text-zinc-500">{description}</p>}
        </div>

        {summary && <div className="hidden shrink-0 text-right sm:block">{summary}</div>}

        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id={contentId}
        hidden={!isOpen}
        className={`border-t border-zinc-700/80 ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
