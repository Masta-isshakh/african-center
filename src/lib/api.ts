import { wait } from './utils';
import { materials, type MaterialsBulletin } from '@/content/materials';
import type { Persona } from './site';
import type { BriefInput, ContactInput } from './schemas';

export type ApiResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: 'network' | 'server' };

/** Every payload may carry `simulateError` to exercise failure UI before the backend exists. */
type Simulatable = { simulateError?: boolean };

async function stub<T = undefined>(payload: Simulatable & Record<string, unknown>, data?: T): Promise<ApiResult<T>> {
  await wait(600);
  if (payload.simulateError) return { ok: false, error: 'server' };
  return { ok: true, data };
}

// TODO(Amplify): connect to AppSync/API — persist the brief and notify the ACEC inbox.
export async function submitProjectBrief(brief: BriefInput & Simulatable): Promise<ApiResult<{ reference: string }>> {
  return stub(brief, { reference: `ACEC-${Date.now().toString(36).toUpperCase()}` });
}

// TODO(Amplify): connect to AppSync/API — store persona interest leads.
export async function registerInterest(persona: Persona, data: Record<string, unknown> & Simulatable): Promise<ApiResult> {
  return stub({ ...data, persona });
}

// TODO(Amplify): connect to AppSync/API — forward contact messages to ACEC60@outlook.com.
export async function sendContactMessage(data: ContactInput & Simulatable): Promise<ApiResult> {
  return stub(data);
}

// TODO(Amplify): connect to AppSync/API — add to the mailing list.
export async function subscribeNewsletter(email: string, options: Simulatable = {}): Promise<ApiResult> {
  return stub({ ...options, email });
}

// TODO(Amplify): connect to AppSync/API — read the weekly price bulletin from the database.
export async function getMaterialPrices(options: Simulatable = {}): Promise<ApiResult<MaterialsBulletin>> {
  return stub(options, materials);
}
