export const faqCategories = ['owners', 'contractors', 'fees', 'design', 'supervision'] as const;
export type FaqCategory = (typeof faqCategories)[number];

export const faqIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'] as const;
export type FaqId = (typeof faqIds)[number];

/** Question text lives in messages under `faqItems.<id>`; `slug` is the deep-link anchor (#q-slug). */
export const faqIndex: { id: FaqId; slug: string; categories: FaqCategory[] }[] = [
  { id: 'q1', slug: 'how-e-tendering-works', categories: ['owners', 'contractors'] },
  { id: 'q2', slug: 'is-it-free', categories: ['owners', 'fees'] },
  { id: 'q3', slug: 'how-we-earn', categories: ['fees', 'contractors'] },
  { id: 'q4', slug: 'what-you-need', categories: ['owners'] },
  { id: 'q5', slug: 'housing-loan', categories: ['owners', 'fees'] },
  { id: 'q6', slug: 'design-duration', categories: ['design'] },
  { id: 'q7', slug: 'building-permit', categories: ['design'] },
  { id: 'q8', slug: 'contractor-selection', categories: ['owners', 'contractors'] },
  { id: 'q9', slug: 'invite-contractor', categories: ['owners', 'contractors'] },
  { id: 'q10', slug: 'contract-breach', categories: ['supervision', 'owners'] },
  { id: 'q11', slug: 'register-contractor-supplier', categories: ['contractors'] },
  { id: 'q12', slug: 'supervision-handover', categories: ['supervision'] },
];
