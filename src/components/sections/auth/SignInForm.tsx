'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CheckCircle2, LogOut } from 'lucide-react';
import { signInSchema, type SignInValues } from '@/lib/schemas';
import { signIn, signOut } from '@/lib/auth';
import type { Persona } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { Honeypot, SubmitButton, TextField, useErrorText } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { PersonaPicker } from './PersonaPicker';
import { PasswordField } from './PasswordField';

export function SignInForm() {
  const t = useTranslations('auth');
  const tf = useTranslations('forms');
  const errorText = useErrorText();
  const [persona, setPersona] = useState<Persona>('owner');
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', website: '' },
  });

  const onSubmit = async (data: SignInValues) => {
    if (data.website) return;
    setLoading(true);
    const res = await signIn({ persona, email: data.email, password: data.password });
    setLoading(false);
    if (!res.ok) {
      toast.error(t('signIn.error'));
      return;
    }
    setSignedIn(true);
  };

  const onSignOut = async () => {
    await signOut();
    toast.success(t('signIn.signedOut'));
    reset();
    setSignedIn(false);
  };

  if (signedIn) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-white">
          <DirIcon icon={CheckCircle2} className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-display-lg font-bold text-navy-800">{t('signIn.successTitle')}</h2>
        <p className="mt-2 text-ink/70">{t('signIn.successBody')}</p>
        <Button variant="outline" className="mt-8" onClick={onSignOut}>
          <DirIcon icon={LogOut} flip className="h-4 w-4" />
          {t('signIn.signOut')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-6">
      <PersonaPicker value={persona} onChange={setPersona} />
      <TextField type="email" ltr autoComplete="email" label={t('email')} error={errorText(formState.errors.email?.message)} {...register('email')} />
      <PasswordField autoComplete="current-password" label={t('password')} error={errorText(formState.errors.password?.message)} {...register('password')} />
      <Honeypot label={tf('fields.honeypot')} {...register('website')} />
      <SubmitButton state={loading ? 'loading' : 'idle'} loadingLabel={t('signIn.submitting')} successLabel={tf('sent')} className="w-full">
        {t('signIn.submit')}
      </SubmitButton>
      <div className="flex flex-col items-center gap-2 text-sm text-ink/70">
        <p>
          {t('signIn.noAccount')}{' '}
          <Link href={`/sign-up?persona=${persona}`} className="font-semibold text-navy-700 underline decoration-gold-500 underline-offset-4 hover:text-gold-700">
            {t('signIn.createAccount')}
          </Link>
        </p>
        <Link href="/contact" className="text-xs hover:text-navy-800">
          {t('signIn.help')}
        </Link>
      </div>
    </form>
  );
}
