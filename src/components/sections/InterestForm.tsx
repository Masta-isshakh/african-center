'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { interestSchema, type InterestInput } from '@/lib/schemas';
import { registerInterest } from '@/lib/api';
import { track } from '@/lib/analytics';
import type { Persona } from '@/lib/site';
import { Honeypot, SubmitButton, TextField, useErrorText, type SubmitState } from '@/components/ui/Form';

/** "Call me back" lead form for visitors who aren't ready to register. */
export function InterestForm({ persona }: { persona: Persona }) {
  const t = useTranslations();
  const errorText = useErrorText();
  const [state, setState] = useState<SubmitState>('idle');
  const { register, handleSubmit, reset, formState } = useForm<InterestInput>({
    resolver: zodResolver(interestSchema),
    defaultValues: { name: '', phone: '', website: '' },
  });

  const onSubmit = async (data: InterestInput) => {
    if (data.website) return;
    setState('loading');
    const res = await registerInterest(persona, { name: data.name, phone: data.phone });
    if (!res.ok) {
      setState('idle');
      toast.error(t('toasts.genericError'));
      return;
    }
    track('cta_register_persona', { persona, placement: 'interest_form' });
    setState('success');
    toast.success(t('toasts.interestSuccess'));
    reset();
    setTimeout(() => setState('idle'), 2600);
  };

  return (
    <div className="mx-auto max-w-2xl border-t border-white/10 pt-10 text-start">
      <h3 className="text-lg text-white">{t('personaPage.interest.title')}</h3>
      <p className="mt-1 text-sm text-white/65">{t('personaPage.interest.body')}</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
        <TextField dark label={t('forms.fields.name')} autoComplete="name" error={errorText(formState.errors.name?.message)} {...register('name')} />
        <TextField dark ltr type="tel" inputMode="tel" autoComplete="tel" label={t('forms.fields.phone')} error={errorText(formState.errors.phone?.message)} {...register('phone')} />
        <Honeypot label={t('forms.fields.honeypot')} {...register('website')} />
        <SubmitButton state={state} loadingLabel={t('forms.sending')} successLabel={t('forms.sent')} className="h-[3.25rem]" dark>
          {t('personaPage.interest.submit')}
        </SubmitButton>
      </form>
    </div>
  );
}
