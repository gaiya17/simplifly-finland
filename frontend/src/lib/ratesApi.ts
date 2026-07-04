const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

// ── Types ──────────────────────────────────────────────────────────
export interface SavedRatesData {
  id:              string;
  resortId:        string;
  pageTitle:       string;
  bookBefore:      string | null;
  currency:        string;
  nightColumns:    string[];
  villaGroups:     any[];
  transferDetails: { label: string; value: string }[];
  mealPlan:        string | null;
  inclusions:      string[];
  specialBenefits: string[];
  updatedAt:       string;
}

// ── API calls ──────────────────────────────────────────────────────

/**
 * Fetch saved rates for a given resort.
 * Returns the saved data or null if none saved yet.
 */
export async function getRates(resortId: string, token: string): Promise<SavedRatesData | null> {
  const res = await fetch(`${getApiUrl()}/rates/${resortId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch saved rates.');
  return res.json();
}

/**
 * Create or update (upsert) rates for a given resort.
 * Returns the saved record with updatedAt.
 */
export async function saveRates(
  resortId: string,
  data: Omit<SavedRatesData, 'id' | 'resortId' | 'updatedAt'>,
  token: string
): Promise<SavedRatesData> {
  const res = await fetch(`${getApiUrl()}/rates/${resortId}`, {
    method:  'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to save rates.');
  }
  return res.json();
}
