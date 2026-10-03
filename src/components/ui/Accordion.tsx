'use client';

import { useEffect, useState } from 'react';
import { Plus, Link2 } from 'lucide-react';
import { DirIcon } from './DirIcon';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  /** Deep-link anchor: the item opens when the URL hash is `#q-<slug>` */
  slug?: string;
  q: string;
  a: string;
}

interface Props {
  items: AccordionItem[];
  copyLinkLabel?: string;
  onCopied?: () => void;
  dark?: boolean;
  /** Question heading level — h2 when the accordion sits directly under the page <h1>. */
  headingLevel?: 'h2' | 'h3';
}

/** One-open accordion with smooth height and optional deep links. */
export function Accordion({ items, copyLinkLabel, onCopied, dark, headingLevel: Heading = 'h3' }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.replace(/^#q-/, '');
      const hit = items.find((i) => i.slug === slug);
      if (hit) {
        setOpen(hit.id);
        requestAnimationFrame(() => document.getElementById(`q-${slug}`)?.scrollIntoView({ block: 'center' }));
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [items]);

  const toggle = (item: AccordionItem) => {
    const next = open === item.id ? null : item.id;
    setOpen(next);
    if (item.slug) history.replaceState(null, '', next ? `#q-${item.slug}` : window.location.pathname + window.location.search);
  };

  const copy = async (item: AccordionItem) => {
    const url = `${window.location.origin}${window.location.pathname}#q-${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      onCopied?.();
    } catch {
      window.location.hash = `q-${item.slug}`;
    }
  };

  return (
    <ul className={cn('divide-y rounded-xl border', dark ? 'divide-white/10 border-white/10' : 'divide-mist border-mist bg-white')}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `panel-${item.id}`;
        return (
          <li key={item.id} id={item.slug ? `q-${item.slug}` : undefined} className="scroll-mt-28">
            <Heading className="font-body text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-5 py-5 text-start text-base font-semibold transition-colors sm:px-6',
                  dark ? 'text-white hover:text-gold-300' : 'text-navy-800 hover:text-gold-700',
                )}
              >
                {item.q}
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-[transform,background-color] duration-300',
                    isOpen ? 'rotate-45 border-gold-500 bg-gold-500 text-navy-950' : dark ? 'border-white/20' : 'border-mist',
                  )}
                >
                  <DirIcon icon={Plus} className="h-4 w-4" />
                </span>
              </button>
            </Heading>
            {/* grid-template-rows 0fr → 1fr animates to the content's natural height in pure CSS */}
            <div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className={cn('overflow-hidden', !isOpen && 'invisible')}>
                  <div className="px-5 pb-6 sm:px-6">
                    <p className={cn('max-w-3xl', dark ? 'text-white/75' : 'text-ink/75')}>{item.a}</p>
                    {item.slug && copyLinkLabel && (
                      <button type="button" onClick={() => copy(item)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 hover:text-gold-800">
                        <DirIcon icon={Link2} className="h-3.5 w-3.5" />
                        {copyLinkLabel}
                      </button>
                    )}
                  </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
