import { brand } from './brand';

type CommissionT = (key: 'commissionKnown' | 'commissionTbd', values?: { percent: string }) => string;

/** "The rate is X%." once `brand.commissionPercent` is set, otherwise "agreed on award". Pass the `faqPage` translator. */
export function commissionPhrase(t: CommissionT): string {
  const pct: number | null = brand.commissionPercent;
  return pct === null ? t('commissionTbd') : t('commissionKnown', { percent: String(pct) });
}
