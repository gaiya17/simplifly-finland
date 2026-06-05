const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};
const API_URL = getApiUrl();

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

export interface HomepageConfig {
  id: string;
  featuredTours: string[];
  featuredResorts: string[];
  galleryImages: string[];
  featuredBlogs: string[];
  updatedAt: string;
}

export interface HomepageData {
  tours: any[];
  resorts: any[];
  gallery: any[];
  blogs: any[];
}

export const homepageApi = {
  // Public
  getHomepageData: async (): Promise<HomepageData> => {
    const res = await fetch(`${API_URL}/homepage/data`);
    return handleRes(res);
  },

  // Admin
  getSettings: async (token: string): Promise<HomepageConfig> => {
    const res = await fetch(`${API_URL}/admin/homepage/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleRes(res);
  },
  updateSettings: async (token: string, data: Partial<HomepageConfig>): Promise<HomepageConfig> => {
    const res = await fetch(`${API_URL}/admin/homepage/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleRes(res);
  }
};
