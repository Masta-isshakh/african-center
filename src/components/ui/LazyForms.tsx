'use client';

import dynamic from 'next/dynamic';

/*
 * Forms below the fold load their validation stack (react-hook-form, zod, sonner) after the page has
 * painted. Skeletons reserve the final height so nothing shifts when they arrive.
 */
const block = (className: string) =>
  function FormSkeleton() {
    return <div aria-hidden="true" className={`animate-pulse rounded-md bg-current opacity-10 ${className}`} />;
  };

export const NewsletterFormLazy = dynamic(() => import('@/components/layout/NewsletterForm').then((m) => m.NewsletterForm), {
  ssr: false,
  loading: block('h-[3.25rem]'),
});

export const ContactFormLazy = dynamic(() => import('@/components/sections/ContactForm').then((m) => m.ContactForm), {
  ssr: false,
  loading: block('h-[27rem]'),
});

export const InterestFormLazy = dynamic(() => import('@/components/sections/InterestForm').then((m) => m.InterestForm), {
  ssr: false,
  loading: block('mx-auto h-36 max-w-2xl'),
});

export const AppToasterLazy = dynamic(() => import('@/components/layout/AppToaster').then((m) => m.AppToaster), { ssr: false });
