/**
 * tourApi.ts — Tour Package API Client
 *
 * Centralizes all HTTP calls related to tour packages and tour categories.
 * Splits into two sections:
 *  - PUBLIC endpoints: used by the customer-facing website (no auth required)
 *  - ADMIN endpoints: require a Bearer token (JWT from login)
 *
 * The API_URL is set via the NEXT_PUBLIC_API_URL environment variable,
 * falling back to localhost for local development.
 * In production, set NEXT_PUBLIC_API_URL in your hosting provider's env config.
 */

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};
const API_URL = getApiUrl();

/**
 * handleRes — Shared response handler for all API calls.
 * - On 401/403: clears auth tokens and redirects to /login (session expired)
 * - On any other error status: throws so the calling component can show an error
 * - On success: parses and returns the JSON body
 */
const handleRes = async (res: Response) => {
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      window.location.href = "/login";
    }
    throw new Error('Session expired');
  }
  if (!res.ok) throw new Error('API Request Failed');
  return res.json();
};

export const tourApi = {
  // Public
  getAllTours: async () => {
    const res = await fetch(`${API_URL}/tours`);
    return handleRes(res);
  },
  getCategories: async () => {
    const res = await fetch(`${API_URL}/tours/categories`);
    return handleRes(res);
  },
  getCategory: async (slug: string) => {
    const res = await fetch(`${API_URL}/tours/category/${slug}`);
    return handleRes(res);
  },
  getTourById: async (id: string) => {
    const res = await fetch(`${API_URL}/tours/${id}`);
    return handleRes(res);
  },
  getTourBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/tours/slug/${slug}`);
    return handleRes(res);
  },
  getOffers: async () => {
    const res = await fetch(`${API_URL}/tours/offers`);
    return handleRes(res);
  },

  // Admin
  getAdminTours: async (token: string) => {
    const res = await fetch(`${API_URL}/admin/tours`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleRes(res);
  },
  createTour: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/admin/tours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleRes(res);
  },
  updateTour: async (token: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/admin/tours/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleRes(res);
  },
  deleteTour: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/admin/tours/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleRes(res);
  },
  toggleStatus: async (token: string, id: string, status: string) => {
    const res = await fetch(`${API_URL}/admin/tours/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleRes(res);
  },
  updateDiscount: async (token: string, id: string, discount: number | null, offerPoster?: string, offerPosterPublicId?: string) => {
    const res = await fetch(`${API_URL}/admin/tours/${id}/discount`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ discount, offerPoster, offerPosterPublicId })
    });
    return handleRes(res);
  },
  createCategory: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/admin/tours/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return handleRes(res);
  },
  updateCategory: async (token: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/admin/tours/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return handleRes(res);
  },
  deleteCategory: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/admin/tours/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleRes(res);
  },
};
