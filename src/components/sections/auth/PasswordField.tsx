'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { TextField } from '@/components/ui/Form';
import { DirIcon } from '@/components/ui/DirIcon';

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string };

export const PasswordField = forwardRef<HTMLInputElement, Props>(function PasswordField(props, ref) {
  const t = useTranslations('auth');
  const [show, setShow] = useState(false);
  return (
    <TextField
      ref={ref}
      ltr
      type={show ? 'text' : 'password'}
      trailing={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t('hidePassword') : t('showPassword')} className="grid h-9 w-9 place-items-center rounded-full text-ink/65 hover:bg-mist">
          <DirIcon icon={show ? EyeOff : Eye} className="h-4 w-4" />
        </button>
      }
      {...props}
    />
  );
});
