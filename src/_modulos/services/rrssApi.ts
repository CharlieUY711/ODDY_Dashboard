/* =====================================================
   RRSS API Service — Frontend ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

/* When Supabase isn't configured yet, BASE is empty → all calls return fallback data */
const IS_CONFIGURED = Boolean(projectId && projectId !== 'YOUR_PROJECT_ID');

const BASE = IS_CONFIGURED
  ? `https://${projectId}.supabase.co/functions/v1/make-server-75638143/rrss`
  : '';

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export type Platform = 'instagram' | 'facebook';

export interface PlatformStatus {
  hasCreds:    boolean;
  savedAt:     string | null;
  verified:    boolean;
  accountName: string | null;
  accountId:   string | null;
  verifiedAt:  string | null;
  error:       string | null;
  status:      'no_creds' | 'pending' | 'connected' | 'coming_soon';
}

export interface AllStatus {
  instagram: PlatformStatus;
  facebook:  PlatformStatus;
  whatsapp:  PlatformStatus;
}

export interface PlatformCreds {
  appId:     string;
  appSecret: string;
  token:     string;
  accountId: string;
  pageId:    string;
  savedAt:   string;
  masked: {
    appId:     string;
    appSecret: string;
    token:     string;
    accountId: string;
    pageId:    string;
  };
  verified: {
    verified:    boolean;
    accountName: string;
    accountId:   string;
    verifiedAt:  string;
    error?:      string;
  } | null;
}

export interface VerifyResult {
  verified:    boolean;
  accountName: string;
  accountId:   string;
  verifiedAt:  string;
  error?:      string;
}

/* ── Fallback status (used when backend is unreachable or not configured) ── */
const NO_CREDS_STATUS: PlatformStatus = {
  hasCreds: false, savedAt: null, verified: false,
  accountName: null, accountId: null, verifiedAt: null,
  error: null, status: 'no_creds',
};

const FALLBACK_STATUS: AllStatus = {
  instagram: { ...NO_CREDS_STATUS },
  facebook:  { ...NO_CREDS_STATUS },
  whatsapp:  { ...NO_CREDS_STATUS, status: 'coming_soon' },
};

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  if (!BASE) return { ok: false, error: 'Supabase not configured' };
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch {
    /* Fail silently in preview / offline mode */
    return { ok: false, error: 'Network unavailable' };
  }
}

async function apiPost<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string } & Record<string, unknown>> {
  if (!BASE) return { ok: false, error: 'Supabase not configured' };
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch {
    return { ok: false, error: 'Network unavailable' };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  if (!BASE) return { ok: false, error: 'Supabase not configured' };
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch {
    return { ok: false, error: 'Network unavailable' };
  }
}

/* ── Public API ── */

/** Get real status of all platforms from the database */
export async function getStatus(): Promise<AllStatus> {
  if (!BASE) return FALLBACK_STATUS;
  const res = await apiGet<AllStatus>('/status');
  if (!res.ok || !res.data) return FALLBACK_STATUS;
  return res.data;
}

/** Get saved credentials for a platform */
export async function getCreds(platform: Platform): Promise<PlatformCreds | null> {
  const res = await apiGet<PlatformCreds>(`/creds/${platform}`);
  if (!res.ok) return null;
  return res.data ?? null;
}

/** Save credentials to the database */
export async function saveCreds(
  platform: Platform,
  creds: { appId: string; appSecret: string; token: string; accountId?: string; pageId?: string }
): Promise<{ ok: boolean; savedAt?: string; error?: string }> {
  if (!BASE) return { ok: false, error: 'Supabase not configured' };
  const res = await apiPost<never>(`/creds/${platform}`, creds);
  return { ok: res.ok, savedAt: res.savedAt as string | undefined, error: res.error };
}

/** Delete credentials from the database */
export async function deleteCreds(platform: Platform): Promise<{ ok: boolean; error?: string }> {
  return apiDelete(`/creds/${platform}`);
}

/** Verify credentials via Meta Graph API — result saved in DB */
export async function verifyCreds(platform: Platform): Promise<{ ok: boolean; data?: VerifyResult; error?: string }> {
  if (!BASE) return { ok: false, error: 'Supabase not configured' };
  const res = await apiPost<VerifyResult>(`/verify/${platform}`);
  return { ok: res.ok, data: res.data, error: res.error };
}
