'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';
import { faqCategories, faqIndex, type FaqCategory } from '@/content/faq';
import { Accordion } from '@/components/ui/Accordion';
import { DirIcon } from '@/components/ui/DirIcon';
import { cn } from '@/lib/utils';
import { normalizeForSearch as normalize } from '@/lib/text';

export function FaqExplorer({ commission }: { commission: string }) {
  const t = useTranslations('faqPage');
  const tq = useTranslations('faqItems');
  const tt = useTranslations('toasts');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategory | 'all'>('all');

  const all = useMemo(
    () => faqIndex.map((f) => ({ ...f, q: tq(`${f.id}.q`), a: tq(`${f.id}.a`, { commission }) })),
    [tq, commission],
  );

  const items = useMemo(() => {
    const n = normalize(query.trim());
    return all.filter((f) => (category === 'all' || f.categories.includes(category)) && (!n || normalize(`${f.q} ${f.a}`).includes(n)));
  }, [all, query, category]);

  return (
    <div>
      <div className="relative">
        <label htmlFor="faq-search" className="sr-only">
          {t('searchLabel')}
        </label>
        <DirIcon icon={Search} className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/65" />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="h-14 w-full rounded-full border border-mist bg-white pe-12 ps-14 text-base outline-none transition focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label={t('searchLabel')} className="absolute end-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/65 hover:bg-mist">
            <DirIcon icon={X} className="h-4 w-4" />
          </button>
        )}
      </div>

      <div role="tablist" aria-label={t('categoriesLabel')} className="no-scrollbar -mx-[2.5vw] mt-6 flex gap-2 overflow-x-auto px-[2.5vw]">
        {(['all', ...faqCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300',
              category === c ? 'bg-gold-500 text-navy-950' : 'text-ink/70 hover:bg-navy-700/5 hover:text-navy-800',
            )}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink/65" aria-live="polite">
        {t('resultsCount', { count: items.length })}
      </p>

      <div className="mt-3">
        {items.length ? (
          <Accordion headingLevel="h2" items={items.map(({ id, slug, q, a }) => ({ id, slug, q, a }))} copyLinkLabel={t('copyLink')} onCopied={() => toast.success(tt('linkCopied'))} />
        ) : (
          <p className="rounded-xl border border-dashed border-mist bg-white p-10 text-center text-ink/70">{t('empty')}</p>
        )}
      </div>
    </div>
  );
}
