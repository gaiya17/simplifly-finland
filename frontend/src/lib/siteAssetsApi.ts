const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export interface SiteAsset {
  key: string;
  url: string;
  publicId?: string | null;
}

export const siteAssetsApi = {
  getAssets: async (): Promise<Record<string, { url: string; publicId: string | null }>> => {
    try {
      const response = await fetch(`${API_URL}/assets`, {
        // Cache heavily because these are static layout assets
        next: { revalidate: 60 } 
      });
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    } catch (error) {
      console.error(error);
      return {};
    }
  },

  updateAsset: async (token: string, key: string, url: string, publicId: string | null) => {
    const response = await fetch(`${API_URL}/assets`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ key, url, publicId })
    });
    if (!response.ok) throw new Error('Failed to update asset');
    return response.json();
  }
};
