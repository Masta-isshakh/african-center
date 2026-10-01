'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { contactSchema, contactSubjects, type ContactInput } from '@/lib/schemas';
import { sendContactMessage } from '@/lib/api';
import { track } from '@/lib/analytics';
import { Honeypot, SelectField, SubmitButton, TextField, TextareaField, useErrorText, type SubmitState } from '@/components/ui/Form';

export function ContactForm() {
  const t = useTranslations();
  const errorText = useErrorText();
  const [state, setState] = useState<SubmitState>('idle');
  const { register, handleSubmit, reset, formState } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', website: '' },
  });
  const e = formState.errors;

  const onSubmit = async (data: ContactInput) => {
    if (data.website) return;
    setState('loading');
    const res = await sendContactMessage(data);
    if (!res.ok) {
      setState('idle');
      toast.error(t('toasts.genericError'));
      return;
    }
    track('contact_submitted', { subject: data.subject });
    setState('success');
    toast.success(t('toasts.contactSuccess'));
    reset();
    setTimeout(() => setState('idle'), 2600);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, () => toast.error(t('toasts.invalidForm')))} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <TextField label={t('forms.fields.name')} autoComplete="name" error={errorText(e.name?.message)} {...register('name')} />
      <SelectField
        label={t('forms.fields.subject')}
        placeholder={t('forms.fields.selectPlaceholder')}
        options={contactSubjects.map((s) => ({ value: s, label: t(`contact.subjects.${s}`) }))}
        error={errorText(e.subject?.message)}
        defaultValue=""
        {...register('subject')}
      />
      <TextField type="email" ltr label={t('forms.fields.email')} autoComplete="email" error={errorText(e.email?.message)} {...register('email')} />
      <TextField type="tel" ltr inputMode="tel" label={t('forms.fields.phone')} autoComplete="tel" hint={t('forms.hints.phone')} error={errorText(e.phone?.message)} {...register('phone')} />
      <TextareaField label={t('forms.fields.message')} className="sm:col-span-2" error={errorText(e.message?.message)} {...register('message')} />
      <Honeypot label={t('forms.fields.honeypot')} {...register('website')} />
      <div className="sm:col-span-2">
        <SubmitButton state={state} loadingLabel={t('forms.sending')} successLabel={t('forms.sent')}>
          {t('forms.submit')}
        </SubmitButton>
      </div>
    </form>
  );
}
