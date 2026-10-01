import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge our custom font sizes so `text-display-xl` isn't mistaken for a colour.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['display-2xl', 'display-xl', 'display-lg', 'eyebrow'] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Two-digit step labels: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0');

export const showSampleContent = process.env.NEXT_PUBLIC_SHOW_SAMPLE_CONTENT === 'true';
