'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Phone, Save, Info } from 'lucide-react';
import {
  briefSchema,
  projectTypes,
  municipalities,
  loanStatuses,
  designStyles,
  budgetRanges,
  contactChannels,
  type BriefInput,
} from '@/lib/schemas';
import { submitProjectBrief } from '@/lib/api';
import { track } from '@/lib/analytics';
import { whatsappHref, telHref } from '@/lib/contact';
import { Link } from '@/i18n/navigation';
import { ChoiceGroup, CheckboxField, Honeypot, SelectField, SubmitButton, TextField, TextareaField, useErrorText } from '@/components/ui/Form';
import { Button, buttonClasses } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { cn, pad2 } from '@/lib/utils';

const STORAGE_KEY = 'acec-brief-v1';
const stepKeys = ['project', 'requirements', 'contact'] as const;
const stepFields: FieldPath<BriefInput>[][] = [
  ['projectType', 'plotArea', 'municipality', 'loanStatus'],
  ['floors', 'bedrooms', 'majlis', 'style', 'budget', 'startDate', 'notes'],
  ['fullName', 'phone', 'email', 'contactChannel', 'consent'],
];

type Draft = Partial<Record<keyof BriefInput, unknown>> & { step?: number };

function BriefWizardInner() {
  const t = useTranslations('start');
  const tf = useTranslations('forms');
  const tw = useTranslations('whatsapp');
  const tc = useTranslations('common');
  const tt = useTranslations('toasts');
  const errorText = useErrorText();
  const rtl = useLocale() === 'ar';
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, trigger, watch, setValue, reset, formState } = useForm<BriefInput>({
    resolver: zodResolver(briefSchema),
    mode: 'onTouched',
    defaultValues: { notes: '', fullName: '', phone: '', email: '', website: '' },
  });
  const e = formState.errors;
  const values = watch();

  // Restore the autosaved draft (sessionStorage — cleared when the tab closes).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { step: savedStep, ...draft } = JSON.parse(raw) as Draft;
        reset({ notes: '', fullName: '', phone: '', email: '', website: '', ...draft } as BriefInput);
        if (typeof savedStep === 'number') setStep(Math.min(2, Math.max(0, savedStep)));
      }
    } catch {
      /* storage unavailable — start fresh */
    }
    setRestored(true);
  }, [reset]);

  useEffect(() => {
    if (!restored || reference) return;
    const sub = watch((v) => {
      try {
        const { website: _hp, consent: _c, ...rest } = v;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, step }));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [watch, step, restored, reference]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const next = async () => {
    const ok = await trigger(stepFields[step]);
    if (!ok) {
      toast.error(tt('invalidForm'));
      return;
    }
    track('brief_step_completed', { step: step + 1 });
    setDir(1);
    setStep((s) => s + 1);
    scrollTop();
  };

  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
    scrollTop();
  };

  const onSubmit = async (data: BriefInput) => {
    if (data.website) return;
    setSubmitting(true);
    const res = await submitProjectBrief(data);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(tt('genericError'));
      return;
    }
    track('brief_step_completed', { step: 3 });
    track('brief_submitted', { projectType: data.projectType, municipality: data.municipality });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setReference(res.data?.reference ?? '');
    scrollTop();
  };

  // Option values come from the same enums the schema validates, so the cast is safe.
  const choice = (name: 'projectType' | 'loanStatus' | 'majlis' | 'style' | 'contactChannel') => ({
    name,
    value: values[name] as string | undefined,
    onChange: (v: string) => setValue(name, v as never, { shouldValidate: true, shouldDirty: true }),
    error: errorText(e[name]?.message),
  });

  if (reference !== null) {
    const wa = whatsappHref(tw('prefillBrief', { reference }));
    return (
      <div ref={topRef} className="scroll-mt-28 rounded-xl border border-mist bg-white p-8 text-center shadow-layered sm:p-12">
        <m.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-white">
          <DirIcon icon={CheckCircle2} className="h-8 w-8" />
        </m.span>
        <p className="eyebrow mt-6 justify-center">{t('success.eyebrow')}</p>
        <h2 className="mt-3 text-display-lg font-bold text-navy-800">{t('success.title')}</h2>
        {reference && (
          <p className="mt-3 font-semibold text-navy-800">{t('success.reference', { reference })}</p>
        )}
        <div className="mx-auto mt-10 max-w-lg text-start">
          <h3 className="text-sm font-semibold text-navy-800">{t('success.next')}</h3>
          <ol className="mt-4 space-y-4">
            {(['n1', 'n2', 'n3'] as const).map((k, i) => (
              <li key={k} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-500/60 font-display text-sm font-bold text-gold-700">
                  <span className="num">{pad2(i + 1)}</span>
                </span>
                <span className="pt-1 text-ink/80">{t(`success.${k}`)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { placement: 'brief_success' })} className={buttonClasses('primary', 'lg', '!bg-whatsapp !text-white')}>
              <DirIcon icon={MessageCircle} className="h-5 w-5" />
              {t('success.whatsapp')}
            </a>
          ) : (
            <a href={telHref()} className={buttonClasses('navy', 'lg')}>
              <DirIcon icon={Phone} className="h-5 w-5" />
              {t('success.call')}
            </a>
          )}
          <Link href="/" className={buttonClasses('outline', 'lg')}>
            {t('success.home')}
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / stepKeys.length) * 100;
  const offset = (rtl ? -1 : 1) * 32;

  return (
    <div ref={topRef} className="scroll-mt-28 overflow-hidden rounded-xl border border-mist bg-white shadow-layered">
      <div className="border-b border-mist p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-navy-800">{t('progress', { current: String(step + 1), total: String(stepKeys.length) })}</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink/65">
            <DirIcon icon={Save} className="h-3.5 w-3.5" />
            {t('autosaved')}
          </p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-label={t('progress', { current: String(step + 1), total: '3' })}>
          <m.div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 rtl:bg-gradient-to-l" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <ol className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {stepKeys.map((k, i) => (
            <li key={k} className={cn('flex items-center gap-2 font-semibold', i <= step ? 'text-navy-800' : 'text-ink/65')}>
              <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[calc(11px*var(--fs))]', i < step ? 'border-gold-500 bg-gold-500 text-navy-950' : i === step ? 'border-gold-500 text-gold-700' : 'border-mist')}>
                <span className="num">{i + 1}</span>
              </span>
              {t(`steps.${k}`)}
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <m.fieldset
            key={step}
            initial={{ opacity: 0, x: dir * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * offset }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <legend className="mb-6 font-display text-display-lg font-bold text-navy-800">{t(`stepTitles.${stepKeys[step]}`)}</legend>

            {step === 0 && (
              <>
                <ChoiceGroup legend={t('fields.projectType')} options={projectTypes.map((v) => ({ value: v, label: t(`projectTypes.${v}`) }))} {...choice('projectType')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField type="number" inputMode="numeric" min={1} ltr label={t('fields.plotArea')} error={errorText(e.plotArea?.message)} {...register('plotArea')} />
                  <SelectField
                    label={t('fields.municipality')}
                    placeholder={tf('fields.selectPlaceholder')}
                    options={municipalities.map((v) => ({ value: v, label: tc(`municipalities.${v}`) }))}
                    error={errorText(e.municipality?.message)}
                    {...register('municipality')}
                  />
                </div>
                <ChoiceGroup legend={t('fields.loanStatus')} options={loanStatuses.map((v) => ({ value: v, label: t(`loanStatuses.${v}`) }))} {...choice('loanStatus')} />
                <p className="flex items-start gap-2 rounded-md bg-sand p-3 text-sm text-ink/70">
                  <DirIcon icon={Info} className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                  {t('loanNote')}
                </p>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField type="number" inputMode="numeric" min={1} ltr label={t('fields.floors')} error={errorText(e.floors?.message)} {...register('floors')} />
                  <TextField type="number" inputMode="numeric" min={0} ltr label={t('fields.bedrooms')} error={errorText(e.bedrooms?.message)} {...register('bedrooms')} />
                </div>
                <ChoiceGroup legend={t('fields.majlis')} options={(['yes', 'no'] as const).map((v) => ({ value: v, label: t(`yesNo.${v}`) }))} {...choice('majlis')} />
                <ChoiceGroup legend={t('fields.style')} columns={3} options={designStyles.map((v) => ({ value: v, label: t(`styles.${v}`) }))} {...choice('style')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label={t('fields.budget')}
                    placeholder={tf('fields.selectPlaceholder')}
                    options={budgetRanges.map((v) => ({ value: v, label: t(`budgets.${v}`) }))}
                    error={errorText(e.budget?.message)}
                    {...register('budget')}
                  />
                  <TextField type="date" ltr label={t('fields.startDate')} error={errorText(e.startDate?.message)} {...register('startDate')} />
                </div>
                <TextareaField label={t('fields.notes')} rows={4} error={errorText(e.notes?.message)} {...register('notes')} />
              </>
            )}

            {step === 2 && (
              <>
                <TextField label={t('fields.fullName')} autoComplete="name" error={errorText(e.fullName?.message)} {...register('fullName')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField type="tel" inputMode="tel" ltr autoComplete="tel" label={t('fields.phone')} hint={tf('hints.phone')} error={errorText(e.phone?.message)} {...register('phone')} />
                  <TextField type="email" ltr autoComplete="email" label={t('fields.email')} error={errorText(e.email?.message)} {...register('email')} />
                </div>
                <ChoiceGroup legend={t('fields.contactChannel')} options={contactChannels.map((v) => ({ value: v, label: t(`channels.${v}`) }))} {...choice('contactChannel')} />
                <CheckboxField label={t('fields.consent')} error={errorText(e.consent?.message)} {...register('consent')} />
                <Honeypot label={tf('fields.honeypot')} {...register('website')} />
              </>
            )}
          </m.fieldset>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-mist pt-6">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}>
              <DirIcon icon={ArrowLeft} flip className="h-4 w-4" />
              {tc('back')}
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button onClick={next} magnetic>
              {tc('next')}
              <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
            </Button>
          ) : (
            <SubmitButton state={submitting ? 'loading' : 'idle'} loadingLabel={t('submitting')} successLabel={tf('sent')}>
              {t('submit')}
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function BriefWizard() {
  return (
    <MotionScope>
      <BriefWizardInner />
    </MotionScope>
  );
}
