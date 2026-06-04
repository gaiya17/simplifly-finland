const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const resortApi = {
  // Public
  getCategories: async () => {
    const res = await fetch(`${API_URL}/resorts/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getCategory: async (slug: string) => {
    const res = await fetch(`${API_URL}/resorts/category/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
  },

  getPublicResorts: async (categorySlug?: string) => {
    const url = categorySlug ? `${API_URL}/resorts?categorySlug=${categorySlug}` : `${API_URL}/resorts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch public resorts");
    return res.json();
  },

  getResortBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/resorts/slug/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch resort by slug");
    return res.json();
  },

  getResort: async (id: string) => {
    const res = await fetch(`${API_URL}/resorts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch resort");
    return res.json();
  },

  // Admin Protected
  getAdminResorts: async (token: string) => {
    const res = await fetch(`${API_URL}/resorts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch admin resorts");
    return res.json();
  },

  createResort: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/resorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create resort");
    return res.json();
  },

  updateResort: async (token: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/resorts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update resort");
    return res.json();
  },

  deleteResort: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/resorts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to delete resort");
    return res.json();
  },

  toggleStatus: async (token: string, id: string, status: string) => {
    const res = await fetch(`${API_URL}/resorts/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },

  updateDiscount: async (token: string, id: string, discount: number | null, offerPoster?: string | null, offerPosterPublicId?: string | null) => {
    const res = await fetch(`${API_URL}/resorts/${id}/discount`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ discount, offerPoster, offerPosterPublicId })
    });
    if (!res.ok) throw new Error("Failed to update discount");
    return res.json();
  },

  getOffers: async () => {
    const res = await fetch(`${API_URL}/resorts/offers`);
    if (!res.ok) throw new Error("Failed to fetch offers");
    return res.json();
  },

  createCategory: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/resorts/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create category");
    }
    return res.json();
  },

  updateCategory: async (token: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/resorts/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update category");
    }
    return res.json();
  },

  deleteCategory: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/resorts/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete category");
    }
    return res.json();
  }
};
