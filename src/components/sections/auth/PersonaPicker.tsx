'use client';

import { useTranslations } from 'next-intl';
import { Home, HardHat, Truck, Compass, Check, type LucideIcon } from 'lucide-react';
import { personas, type Persona } from '@/lib/site';
import { DirIcon } from '@/components/ui/DirIcon';
import { cn } from '@/lib/utils';

const icons: Record<Persona, LucideIcon> = { owner: Home, contractor: HardHat, supplier: Truck, consultant: Compass };

export function PersonaPicker({ value, onChange }: { value: Persona; onChange: (p: Persona) => void }) {
  const t = useTranslations();
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-navy-800">{t('auth.personaLabel')}</legend>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {personas.map((p) => {
          const on = value === p;
          return (
            <label
              key={p}
              className={cn(
                'relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-[border-color,box-shadow,background-color] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gold-500/25',
                on ? 'border-gold-500 bg-gold-50/70 shadow-[0_0_0_1px_rgba(201,154,46,.5)]' : 'border-mist bg-white hover:border-navy-200',
              )}
            >
              <input type="radio" name="persona" value={p} checked={on} onChange={() => onChange(p)} className="sr-only" />
              <span className="flex items-center justify-between">
                <span className={cn('grid h-9 w-9 place-items-center rounded-full', on ? 'bg-gold-500 text-navy-950' : 'bg-navy-700 text-gold-300')}>
                  <DirIcon icon={icons[p]} className="h-4 w-4" />
                </span>
                {on && <DirIcon icon={Check} className="h-4 w-4 text-gold-700" strokeWidth={3} />}
              </span>
              <span className="font-semibold text-navy-800">{t(`common.personas.${p}`)}</span>
              <span className="text-xs leading-snug text-ink/70">{t(`auth.personaHint.${p}`)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
