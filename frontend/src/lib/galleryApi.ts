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
    const url = new URL(`${API_URL}/gallery`);
    if (category && category !== 'All') {
      url.searchParams.append('category', category);
    }
    const res = await fetch(url.toString());
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
