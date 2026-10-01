import { z } from 'zod';

/**
 * Error messages are i18n keys under `forms.errors` and are translated where they render,
 * so the same schema serves both locales on the client and (later) the server.
 */
export type ErrorKey =
  | 'required'
  | 'email'
  | 'phone'
  | 'tooShort'
  | 'tooLong'
  | 'number'
  | 'positive'
  | 'consent'
  | 'select'
  | 'password'
  | 'passwordMatch'
  | 'date';

const msg = (key: ErrorKey) => ({ message: key });

/** Qatar numbers: 8 digits (mobile 3/5/6/7, landline 4), optional +974 / 00974 prefix. */
export const QATAR_PHONE = /^(?:\+974|00974|974)?[34567]\d{7}$/;
export const normalizePhone = (v: string) => v.replace(/[\s\-()]/g, '');

const requiredText = (max = 120) => z.string().trim().min(1, msg('required')).max(max, msg('tooLong'));
const email = z.string().trim().min(1, msg('required')).email(msg('email'));
const phone = z
  .string()
  .trim()
  .min(1, msg('required'))
  .refine((v) => QATAR_PHONE.test(normalizePhone(v)), msg('phone'));
/** Honeypot: hidden from people, irresistible to bots. Any value means spam. */
const honeypot = z.string().max(0).optional();

export const projectTypes = ['villa', 'loanVilla', 'commercial', 'renovation', 'supply'] as const;
export const municipalities = [
  'alRayyan',
  'doha',
  'alWakrah',
  'ummSalal',
  'alKhor',
  'alDaayen',
  'alShamal',
  'alShahaniya',
] as const;
export const loanStatuses = ['housing', 'qdb', 'self', 'other'] as const;
export const designStyles = ['classic', 'modern', 'mixed'] as const;
export const budgetRanges = ['upTo1m', '1to1_5m', '1_5to2m', '2to3m', 'above3m', 'undecided'] as const;
export const contactChannels = ['call', 'whatsapp'] as const;

const int = (min: number, max: number) =>
  z.coerce.number({ invalid_type_error: 'number' }).int(msg('number')).min(min, msg('positive')).max(max, msg('tooLong'));

export const briefStep1Schema = z.object({
  projectType: z.enum(projectTypes, { errorMap: () => msg('select') }),
  plotArea: z.coerce.number({ invalid_type_error: 'number' }).positive(msg('positive')).max(100000, msg('tooLong')),
  municipality: z.enum(municipalities, { errorMap: () => msg('select') }),
  loanStatus: z.enum(loanStatuses, { errorMap: () => msg('select') }),
});

export const briefStep2Schema = z.object({
  floors: int(1, 10),
  bedrooms: int(0, 20),
  majlis: z.enum(['yes', 'no'], { errorMap: () => msg('select') }),
  style: z.enum(designStyles, { errorMap: () => msg('select') }),
  budget: z.enum(budgetRanges, { errorMap: () => msg('select') }),
  startDate: z
    .string()
    .trim()
    .min(1, msg('required'))
    .refine((v) => !Number.isNaN(Date.parse(v)), msg('date')),
  notes: z.string().trim().max(1500, msg('tooLong')).optional(),
});

export const briefStep3Schema = z.object({
  fullName: requiredText(),
  phone,
  email,
  contactChannel: z.enum(contactChannels, { errorMap: () => msg('select') }),
  consent: z.literal(true, { errorMap: () => msg('consent') }),
  website: honeypot,
});

export const briefSchema = briefStep1Schema.merge(briefStep2Schema).merge(briefStep3Schema);
export type BriefInput = z.infer<typeof briefSchema>;
export const briefStepSchemas = [briefStep1Schema, briefStep2Schema, briefStep3Schema] as const;

export const contactSubjects = ['newProject', 'contractor', 'supplier', 'consultant', 'other'] as const;

export const contactSchema = z.object({
  name: requiredText(),
  subject: z.enum(contactSubjects, { errorMap: () => msg('select') }),
  email,
  phone,
  message: z.string().trim().min(10, msg('tooShort')).max(2000, msg('tooLong')),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({ email, website: honeypot });
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const interestSchema = z.object({ name: requiredText(), phone, website: honeypot });
export type InterestInput = z.infer<typeof interestSchema>;

/* ── Auth ── */
const password = z
  .string()
  .min(8, msg('password'))
  .regex(/[A-Za-z]/, msg('password'))
  .regex(/\d/, msg('password'));

export const signInSchema = z.object({
  email,
  password: z.string().min(1, msg('required')),
  website: honeypot,
});
export type SignInValues = z.infer<typeof signInSchema>;

export const contractorClasses = ['first', 'second', 'third', 'fourth', 'unclassified'] as const;
export const supplyCategories = [
  'steel',
  'cement',
  'aggregates',
  'blocks',
  'readyMix',
  'mep',
  'finishes',
  'other',
] as const;

const crNumber = z
  .string()
  .trim()
  .min(1, msg('required'))
  .regex(/^\d{3,10}(?:[-/]\d{1,4})?$/, msg('number'));

/** Step 1 — company (or owner profile). Each persona registers with what we actually need from it. */
export const signUpProfileSchemas = {
  owner: z.object({
    municipality: z.enum(municipalities, { errorMap: () => msg('select') }),
    loanStatus: z.enum(loanStatuses, { errorMap: () => msg('select') }),
  }),
  contractor: z.object({
    companyName: requiredText(),
    crNumber,
    classification: z.enum(contractorClasses, { errorMap: () => msg('select') }),
  }),
  supplier: z.object({
    companyName: requiredText(),
    crNumber,
    categories: z.array(z.enum(supplyCategories)).min(1, msg('select')),
  }),
  consultant: z.object({
    companyName: requiredText(),
    engineeringReg: requiredText(30),
  }),
} as const;

export const signUpContactSchema = z.object({
  fullName: requiredText(),
  phone,
  city: z.enum(municipalities, { errorMap: () => msg('select') }),
});

export const signUpCredentialsSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string().min(1, msg('required')),
    consent: z.literal(true, { errorMap: () => msg('consent') }),
    website: honeypot,
  })
  .refine((v) => v.password === v.confirmPassword, { ...msg('passwordMatch'), path: ['confirmPassword'] });
