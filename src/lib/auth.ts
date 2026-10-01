import { wait } from './utils';
import type { Persona } from './site';

export type AuthResult =
  | { ok: true; nextStep: 'DONE' | 'CONFIRM_SIGN_UP' }
  | { ok: false; error: 'invalid_credentials' | 'user_exists' | 'network' };

export interface SignInInput {
  persona: Persona;
  email: string;
  password: string;
  simulateError?: boolean;
}

export interface SignUpInput {
  persona: Persona;
  profile: Record<string, string | string[] | undefined>;
  contact: { fullName: string; phone: string; city: string };
  email: string;
  password: string;
  simulateError?: boolean;
}

// TODO(Amplify Auth / Cognito): replace with `signIn` from 'aws-amplify/auth'.
export async function signIn(input: SignInInput): Promise<AuthResult> {
  await wait(600);
  if (input.simulateError) return { ok: false, error: 'invalid_credentials' };
  return { ok: true, nextStep: 'DONE' };
}

// TODO(Amplify Auth / Cognito): replace with `signUp` from 'aws-amplify/auth', storing persona + profile as user attributes.
export async function signUp(input: SignUpInput): Promise<AuthResult> {
  await wait(600);
  if (input.simulateError) return { ok: false, error: 'user_exists' };
  return { ok: true, nextStep: 'CONFIRM_SIGN_UP' };
}

// TODO(Amplify Auth / Cognito): replace with `signOut` from 'aws-amplify/auth'.
export async function signOut(): Promise<AuthResult> {
  await wait(300);
  return { ok: true, nextStep: 'DONE' };
}
