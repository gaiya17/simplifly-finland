export interface ChatbotOption {
  label: string;
  next: string;
}

export interface ChatbotNode {
  id: string;
  from: 'bot' | 'user';
  message: string;
  options?: ChatbotOption[];
  action?: 'whatsapp' | 'restart' | string;
  whatsappText?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};
const API_URL = getApiUrl();
const BASE_URL = `${API_URL}/chatbot`;

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const chatbotApi = {
  // Get all nodes as a Record mapping id -> ChatbotNode (for the FloatingContact flow)
  getFlow: async (): Promise<Record<string, ChatbotNode>> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch chatbot flow');
    return res.json();
  },

  // Get all nodes as an Array (for Admin Dashboard)
  getNodes: async (): Promise<ChatbotNode[]> => {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch chatbot nodes');
    return res.json();
  },

  // Admin: Create a new node
  createNode: async (data: Partial<ChatbotNode>): Promise<ChatbotNode> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create node');
    return res.json();
  },

  // Admin: Update an existing node
  updateNode: async (id: string, data: Partial<ChatbotNode>): Promise<ChatbotNode> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update node');
    return res.json();
  },

  // Admin: Delete a node
  deleteNode: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete node');
    return res.json();
  }
};

