'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, MailCheck, Info } from 'lucide-react';
import type { z } from 'zod';
import {
  signUpProfileSchemas,
  signUpContactSchema,
  signUpCredentialsSchema,
  contractorClasses,
  supplyCategories,
  municipalities,
  loanStatuses,
} from '@/lib/schemas';
import { signUp } from '@/lib/auth';
import { track } from '@/lib/analytics';
import { isPersona, type Persona } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { ChoiceGroup, CheckboxField, Honeypot, SelectField, SubmitButton, TextField, useErrorText } from '@/components/ui/Form';
import { Button, buttonClasses } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { PersonaPicker } from './PersonaPicker';
import { PasswordField } from './PasswordField';
import { cn } from '@/lib/utils';

type Profile = Record<string, string | string[] | undefined>;
type Contact = z.infer<typeof signUpContactSchema>;
type Credentials = z.infer<typeof signUpCredentialsSchema>;

/* ── Step 1: company (or owner profile) ── */
function ProfileStep({ persona, initial, onDone }: { persona: Persona; initial: Profile; onDone: (p: Profile) => void }) {
  const t = useTranslations('auth.signUp');
  const tf = useTranslations('forms');
  const tc = useTranslations('common');
  const ts = useTranslations('start');
  const errorText = useErrorText();
  const { register, handleSubmit, formState, watch, setValue } = useForm<Profile>({
    resolver: zodResolver(signUpProfileSchemas[persona]),
    defaultValues: { categories: [], ...initial },
  });
  const e = formState.errors as Record<string, { message?: string } | undefined>;
  const categories = (watch('categories') as string[] | undefined) ?? [];
  const toggleCategory = (v: string) =>
    setValue('categories', categories.includes(v) ? categories.filter((c) => c !== v) : [...categories, v], { shouldValidate: true });

  return (
    <form id="signup-step" onSubmit={handleSubmit(onDone)} noValidate className="space-y-5">
      {persona === 'owner' ? (
        <>
          <p className="flex items-start gap-2 rounded-md bg-sand p-4 text-sm text-ink/75">
            <DirIcon icon={Info} className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
            <span>
              {t('ownerNote')}{' '}
              <Link href="/start" className="font-semibold text-navy-700 underline decoration-gold-500 underline-offset-4">
                {t('ownerNoteCta')}
              </Link>
            </span>
          </p>
          <SelectField
            label={t('fields.municipality')}
            placeholder={tf('fields.selectPlaceholder')}
            options={municipalities.map((v) => ({ value: v, label: tc(`municipalities.${v}`) }))}
            error={errorText(e.municipality?.message)}
            {...register('municipality')}
          />
          <SelectField
            label={t('fields.loanStatus')}
            placeholder={tf('fields.selectPlaceholder')}
            options={loanStatuses.map((v) => ({ value: v, label: ts(`loanStatuses.${v}`) }))}
            error={errorText(e.loanStatus?.message)}
            {...register('loanStatus')}
          />
        </>
      ) : (
        <>
          <TextField label={t('fields.companyName')} autoComplete="organization" error={errorText(e.companyName?.message)} {...register('companyName')} />
          {persona !== 'consultant' && <TextField ltr inputMode="numeric" label={t('fields.crNumber')} error={errorText(e.crNumber?.message)} {...register('crNumber')} />}
          {persona === 'contractor' && (
            <SelectField
              label={t('fields.classification')}
              placeholder={tf('fields.selectPlaceholder')}
              options={contractorClasses.map((v) => ({ value: v, label: t(`classes.${v}`) }))}
              error={errorText(e.classification?.message)}
              {...register('classification')}
            />
          )}
          {persona === 'supplier' && (
            <ChoiceGroup
              multiple
              columns={3}
              legend={t('fields.categories')}
              name="categories"
              options={supplyCategories.map((v) => ({ value: v, label: t(`categoryOptions.${v}`) }))}
              value={categories}
              onChange={toggleCategory}
              error={errorText(e.categories?.message)}
            />
          )}
          {persona === 'consultant' && <TextField ltr label={t('fields.engineeringReg')} error={errorText(e.engineeringReg?.message)} {...register('engineeringReg')} />}
        </>
      )}
    </form>
  );
}

/* ── Step 2: contact ── */
function ContactStep({ persona, initial, onDone }: { persona: Persona; initial: Partial<Contact>; onDone: (c: Contact) => void }) {
  const t = useTranslations('auth.signUp');
  const tf = useTranslations('forms');
  const tc = useTranslations('common');
  const errorText = useErrorText();
  const { register, handleSubmit, formState } = useForm<Contact>({
    resolver: zodResolver(signUpContactSchema),
    defaultValues: { fullName: '', phone: '', ...initial },
  });
  const e = formState.errors;
  return (
    <form id="signup-step" onSubmit={handleSubmit(onDone)} noValidate className="space-y-5">
      <TextField label={persona === 'owner' ? t('fields.ownerFullName') : t('fields.fullName')} autoComplete="name" error={errorText(e.fullName?.message)} {...register('fullName')} />
      <TextField type="tel" ltr inputMode="tel" autoComplete="tel" label={t('fields.phone')} hint={tf('hints.phone')} error={errorText(e.phone?.message)} {...register('phone')} />
      <SelectField
        label={t('fields.city')}
        placeholder={tf('fields.selectPlaceholder')}
        options={municipalities.map((v) => ({ value: v, label: tc(`municipalities.${v}`) }))}
        error={errorText(e.city?.message)}
        {...register('city')}
      />
    </form>
  );
}

/* ── Step 3: credentials ── */
function CredentialsStep({ onDone }: { onDone: (c: Credentials) => void }) {
  const t = useTranslations('auth');
  const tf = useTranslations('forms');
  const errorText = useErrorText();
  const { register, handleSubmit, formState } = useForm<Credentials>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', website: '' },
  });
  const e = formState.errors;
  return (
    <form id="signup-step" onSubmit={handleSubmit(onDone)} noValidate className="relative space-y-5">
      <TextField type="email" ltr autoComplete="email" label={t('email')} error={errorText(e.email?.message)} {...register('email')} />
      <PasswordField autoComplete="new-password" label={t('password')} hint={t('signUp.passwordHint')} error={errorText(e.password?.message)} {...register('password')} />
      <PasswordField autoComplete="new-password" label={t('signUp.fields.confirmPassword')} error={errorText(e.confirmPassword?.message)} {...register('confirmPassword')} />
      <CheckboxField label={t('signUp.fields.consent')} error={errorText(e.consent?.message)} {...register('consent')} />
      <Honeypot label={tf('fields.honeypot')} {...register('website')} />
    </form>
  );
}

/** Persona picker + three steps: company → contact → credentials. `?persona=` pre-selects the role. */
function SignUpWizardInner() {
  const t = useTranslations('auth.signUp');
  const tc = useTranslations('common');
  const rtl = useLocale() === 'ar';
  const params = useSearchParams();
  const initialPersona = params.get('persona');
  const [persona, setPersona] = useState<Persona>(isPersona(initialPersona) ? initialPersona : 'contractor');
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [profile, setProfile] = useState<Profile>({});
  const [contact, setContact] = useState<Partial<Contact>>({});
  const [loading, setLoading] = useState(false);
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  const steps = [persona === 'owner' ? 'profile' : 'company', 'contact', 'credentials'] as const;
  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const finish = async (cred: Credentials) => {
    if (cred.website) return;
    setLoading(true);
    const res = await signUp({ persona, profile, contact: contact as Contact, email: cred.email, password: cred.password });
    setLoading(false);
    if (!res.ok) {
      toast.error(t('error'));
      return;
    }
    track('cta_register_persona', { persona, placement: 'sign_up_complete' });
    setDoneEmail(cred.email);
  };

  if (doneEmail) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-white">
          <DirIcon icon={MailCheck} className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-display-lg font-bold text-navy-800">{t('successTitle')}</h2>
        <p className="mt-2 text-ink/70">{t('successBody', { email: doneEmail })}</p>
        <Link href="/sign-in" className={buttonClasses('primary', 'md', 'mt-8')}>
          {t('toSignIn')}
        </Link>
      </div>
    );
  }

  const offset = (rtl ? -1 : 1) * 28;

  return (
    <div className="space-y-8">
      <PersonaPicker
        value={persona}
        onChange={(p) => {
          setPersona(p);
          setProfile({});
          go(0);
        }}
      />

      <ol className="grid grid-cols-3 gap-2">
        {steps.map((s, i) => (
          <li key={s} className="text-xs font-semibold">
            <span className={cn('block h-1 rounded-full transition-colors duration-500', i <= step ? 'bg-gold-500' : 'bg-mist')} />
            <span className={cn('mt-2 block', i <= step ? 'text-navy-800' : 'text-ink/65')}>
              <span className="num">{i + 1}</span>. {t(`steps.${s}`)}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={`${persona}-${step}`}
          initial={{ opacity: 0, x: dir * offset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -dir * offset }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <ProfileStep
              persona={persona}
              initial={profile}
              onDone={(p) => {
                setProfile(p);
                go(1);
              }}
            />
          )}
          {step === 1 && (
            <ContactStep
              persona={persona}
              initial={contact}
              onDone={(c) => {
                setContact(c);
                go(2);
              }}
            />
          )}
          {step === 2 && <CredentialsStep onDone={finish} />}
        </m.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 border-t border-mist pt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => go(step - 1)}>
            <DirIcon icon={ArrowLeft} flip className="h-4 w-4" />
            {tc('back')}
          </Button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <Button type="submit" form="signup-step">
            {tc('next')}
            <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
          </Button>
        ) : (
          <SubmitButton state={loading ? 'loading' : 'idle'} loadingLabel={t('submitting')} successLabel={t('successTitle')} form="signup-step">
            {t('submit')}
          </SubmitButton>
        )}
      </div>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function SignUpWizard() {
  return (
    <MotionScope>
      <SignUpWizardInner />
    </MotionScope>
  );
}
