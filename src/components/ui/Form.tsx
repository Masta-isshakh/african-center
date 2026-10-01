'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import type { ErrorKey } from '@/lib/schemas';
import { DirIcon } from './DirIcon';
import { cn } from '@/lib/utils';

const errorKeys: ErrorKey[] = ['required', 'email', 'phone', 'tooShort', 'tooLong', 'number', 'positive', 'consent', 'select', 'password', 'passwordMatch', 'date'];

/** Zod messages are i18n keys; anything unexpected falls back to "required". */
export function useErrorText() {
  const t = useTranslations('forms.errors');
  return (message?: string) => {
    if (!message) return undefined;
    return t(errorKeys.includes(message as ErrorKey) ? (message as ErrorKey) : 'required');
  };
}

function FieldMessage({ id, error, hint, dark }: { id: string; error?: string; hint?: string; dark?: boolean }) {
  if (error)
    return (
      <p id={id} role="alert" className={cn('mt-1.5 flex items-center gap-1.5 text-xs font-medium', dark ? 'text-red-300' : 'text-error')}>
        <DirIcon icon={AlertCircle} className="h-3.5 w-3.5 shrink-0" />
        {error}
      </p>
    );
  if (hint) return <p id={id} className={cn('mt-1.5 text-xs', dark ? 'text-white/55' : 'text-ink/65')}>{hint}</p>;
  return null;
}

const fieldBase = (error?: string, dark?: boolean) =>
  cn(
    'peer block w-full rounded-md border bg-white px-4 pb-2 pt-6 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15',
    error ? 'border-error' : 'border-mist hover:border-navy-200',
    dark && 'border-white/15 bg-white/5 text-white hover:border-white/30',
  );

const floatingLabel = (dark?: boolean) =>
  cn(
    'pointer-events-none absolute start-4 top-4 origin-[0] text-[0.9375rem] transition-all duration-200 rtl:origin-[100%]',
    'peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold',
    dark ? 'text-white/60 peer-focus:text-gold-300' : 'text-ink/65 peer-focus:text-gold-700',
  );

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  dark?: boolean;
  /** Digits, emails and phone numbers are entered left-to-right in both locales. */
  ltr?: boolean;
  trailing?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, dark, ltr, trailing, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          dir={ltr ? 'ltr' : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(error, dark), ltr && 'rtl:text-end', trailing && 'pe-12')}
          {...props}
        />
        <label htmlFor={inputId} className={floatingLabel(dark)}>
          {label}
        </label>
        {trailing && <div className="absolute inset-y-0 end-2 flex items-center">{trailing}</div>}
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} dark={dark} />
    </div>
  );
});

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  dark?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, error, hint, dark, className, id, rows = 5, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(error, dark), 'resize-y pt-7')}
          {...props}
        />
        <label htmlFor={inputId} className={floatingLabel(dark)}>
          {label}
        </label>
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} dark={dark} />
    </div>
  );
});

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  dark?: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, dark, className, id, placeholder, options, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(error, dark), 'appearance-none pe-10')}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label htmlFor={inputId} className={cn('pointer-events-none absolute start-4 top-2 text-xs font-semibold', dark ? 'text-white/60' : 'text-ink/65')}>
          {label}
        </label>
        <DirIcon icon={ChevronDown} className={cn('pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2', dark ? 'text-white/50' : 'text-ink/65')} />
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} dark={dark} />
    </div>
  );
});

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  dark?: boolean;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField({ label, error, dark, className, id, ...props }, ref) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className={cn('flex cursor-pointer items-start gap-3 text-sm', dark ? 'text-white/80' : 'text-ink/80')}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-mist accent-gold-600"
          {...props}
        />
        <span>{label}</span>
      </label>
      <FieldMessage id={msgId} error={error} dark={dark} />
    </div>
  );
}
);

interface ChoiceGroupProps {
  legend: string;
  name: string;
  options: { value: string; label: string; hint?: string }[];
  value: string | string[] | undefined;
  onChange: (value: string) => void;
  error?: string;
  multiple?: boolean;
  columns?: 2 | 3;
  className?: string;
}

/** Card-style radio (or checkbox) group with a visible legend. */
export function ChoiceGroup({ legend, name, options, value, onChange, error, multiple, columns = 2, className }: ChoiceGroupProps) {
  const id = useId();
  const msgId = `${id}-msg`;
  const selected = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <fieldset className={className} aria-describedby={error ? msgId : undefined}>
      <legend className="mb-2 text-sm font-semibold text-navy-800">{legend}</legend>
      <div className={cn('grid gap-2.5', columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}>
        {options.map((o) => {
          const on = selected(o.value);
          return (
            <label
              key={o.value}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-md border bg-white px-4 py-3 text-sm transition-[border-color,box-shadow,background-color] duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gold-500/25',
                on ? 'border-gold-500 bg-gold-50/60 shadow-[0_0_0_1px_rgba(201,154,46,.5)]' : 'border-mist hover:border-navy-200',
              )}
            >
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 grid h-4 w-4 shrink-0 place-items-center border transition-colors',
                  multiple ? 'rounded' : 'rounded-full',
                  on ? 'border-gold-600 bg-gold-500 text-navy-950' : 'border-navy-200',
                )}
              >
                {on && <DirIcon icon={Check} className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span>
                <span className="font-medium text-ink">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-xs text-ink/65">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <FieldMessage id={msgId} error={error} />
    </fieldset>
  );
}

/** Off-screen trap field. Real people never see or fill it. */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string }>(function Honeypot({ label, ...props }, ref) {
  return (
    <div aria-hidden="true" className="absolute -start-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        {label}
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
});

export type SubmitState = 'idle' | 'loading' | 'success';

/** idle → spinner → check */
export function SubmitButton({ state, children, loadingLabel, successLabel, className, dark, form }: { state: SubmitState; children: ReactNode; loadingLabel: string; successLabel: string; className?: string; dark?: boolean; form?: string }) {
  return (
    <button
      type="submit"
      form={form}
      disabled={state !== 'idle'}
      aria-live="polite"
      className={cn(
        'btn-sheen relative inline-flex h-12 min-w-[10rem] items-center justify-center gap-2 overflow-hidden rounded-full px-7 font-semibold transition-colors duration-300 disabled:cursor-default',
        state === 'success' ? 'bg-success text-white' : 'bg-gold-500 text-navy-950 hover:bg-gold-400',
        dark && state === 'idle' && 'shadow-[0_8px_24px_-10px_rgba(201,154,46,.7)]',
        className,
      )}
    >
      {/* keyed so each state change remounts and replays a short rise-in */}
      <span key={state} className="rise-in inline-flex items-center gap-2" style={{ animationDuration: '250ms' }}>
        {state === 'loading' && <DirIcon icon={Loader2} className="h-4 w-4 animate-spin" />}
        {state === 'success' && <DirIcon icon={Check} className="h-4 w-4" strokeWidth={3} />}
        {state === 'idle' ? children : state === 'loading' ? loadingLabel : successLabel}
      </span>
    </button>
  );
}
