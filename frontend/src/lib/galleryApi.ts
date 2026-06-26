const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};
const API_URL = getApiUrl();

export const galleryApi = {
  // Get all assets, optionally filtered by category
  getAssets: async (category?: string) => {
    // Use string concatenation instead of new URL() — new URL() requires
    // an absolute base, but API_URL may be a relative path like '/api'.
    // fetch() handles relative URLs natively in browsers.
    const params = category && category !== 'All'
      ? `?category=${encodeURIComponent(category)}`
      : '';
    const res = await fetch(`${API_URL}/gallery${params}`);
    if (!res.ok) throw new Error("Failed to fetch gallery assets");
    return res.json();
  },

  // Create a new asset
  createAsset: async (data: { title: string; category: string; url: string; publicId: string; size?: string; format?: string }) => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const res = await fetch(`${API_URL}/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create asset");
    return res.json();
  },

  // Delete an asset
  deleteAsset: async (id: string) => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to delete asset");
    return res.json();
  }
};
