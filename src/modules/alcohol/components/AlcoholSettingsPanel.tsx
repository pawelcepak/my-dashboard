import { Link2 } from 'lucide-react';

import type { PortfolioTag } from '@/modules/portfolio/types/portfolio.types';

type AlcoholSettingsPanelProps = {
  tags: PortfolioTag[];
  selectedTagIds: string[];
  isSaving: boolean;
  onChange: (tagIds: string[]) => Promise<void>;
};

export default function AlcoholSettingsPanel({
  tags,
  selectedTagIds,
  isSaving,
  onChange,
}: AlcoholSettingsPanelProps) {
  const expenseTags = tags.filter((tag) => tag.kind === 'expense' || tag.kind === 'both');

  function toggleTag(tagId: string) {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    void onChange(next);
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex items-center gap-3 border-b border-zinc-700 px-4 py-3">
        <Link2 className="size-4 text-[var(--app-accent)]" />
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Powiązanie z Portfelem</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Od czerwca 2026 wydatki są sumowane z wybranych tagów
          </p>
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {expenseTags.map((tag) => (
          <label
            key={tag.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950/35 p-3"
          >
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              disabled={isSaving}
              onChange={() => toggleTag(tag.id)}
              className="size-4 accent-[var(--app-accent)]"
            />
            <span className="text-sm font-medium text-zinc-300">{tag.name}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
