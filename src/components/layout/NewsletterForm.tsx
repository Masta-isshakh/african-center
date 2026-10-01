'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { newsletterSchema, type NewsletterInput } from '@/lib/schemas';
import { subscribeNewsletter } from '@/lib/api';
import { Honeypot, SubmitButton, TextField, useErrorText, type SubmitState } from '@/components/ui/Form';

export function NewsletterForm() {
  const t = useTranslations();
  const errorText = useErrorText();
  const [state, setState] = useState<SubmitState>('idle');
  const { register, handleSubmit, reset, formState } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (data: NewsletterInput) => {
    if (data.website) return; // honeypot
    setState('loading');
    const res = await subscribeNewsletter(data.email);
    if (res.ok) {
      setState('success');
      toast.success(t('toasts.newsletterSuccess'));
      reset();
      setTimeout(() => setState('idle'), 2400);
    } else {
      setState('idle');
      toast.error(t('toasts.genericError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative flex flex-col gap-3 sm:flex-row sm:items-start">
      <TextField
        type="email"
        autoComplete="email"
        ltr
        dark
        label={t('footer.newsletter.placeholder')}
        error={errorText(formState.errors.email?.message)}
        className="flex-1"
        {...register('email')}
      />
      <Honeypot label={t('forms.fields.honeypot')} {...register('website')} />
      <SubmitButton state={state} loadingLabel={t('forms.sending')} successLabel={t('forms.sent')} className="h-[3.25rem] min-w-[8rem]" dark>
        {t('footer.newsletter.cta')}
      </SubmitButton>
    </form>
  );
}
