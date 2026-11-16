// Thin client for the AVS ASP.NET Core API.
// Public pages render from seed content (src/data) and are revalidated against
// the API when NEXT_PUBLIC_API_URL is set, so the site never breaks if the API
// is temporarily unreachable.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export async function fetchContent<T>(path: string, fallback: T, revalidate = 300): Promise<T> {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    const data = (await res.json()) as T;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export type LeadPayload = {
  formType: 'contact' | 'demo' | 'product';
  name: string;
  organisation: string;
  designation: string;
  mobile: string;
  email: string;
  institutionType: string;
  productInterest: string;
  message: string;
  consent: boolean;
  website?: string; // honeypot
  sourcePage?: string;
};

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; message: string }> {
  if (!API_URL) {
    // Development fallback so the form can be exercised without the API.
    console.info('[lead] API not configured – payload', payload);
    return { ok: true, message: 'Thank you! Our team will contact you shortly.' };
  }
  try {
    const res = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: data?.message || 'Something went wrong. Please try again.' };
    return { ok: true, message: data?.message || 'Thank you! Our team will contact you shortly.' };
  } catch {
    return { ok: false, message: 'Unable to reach the server. Please call +91 9029088876 or email sales@avsinsotech.com.' };
  }
}
