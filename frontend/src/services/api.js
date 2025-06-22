import axios from 'axios';

const API_URL = 'https://store-rating-f515.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const API = {
  register: async ({name, email, password, address, role = 'user'}) => {
    try {
      const response = await api.post('/auth/register', {name, email, password, address, role});
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  getStores: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/stores${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stores' };
    }
  },

  submitRating: async ({ storeId, rating }) => {
    try {
      const response = await api.post('/ratings', { storeId, rating });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit rating' };
    }
  },

  getAdminStats: async () => {
    try {
      const response = await api.get('/users/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin stats' };
    }
  },

  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/users${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  getOwnerDashboard: async () => {
    try {
      const response = await api.get('/stores/owner/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch owner dashboard' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  createStore: async (storeData) => {
    try {
      const response = await api.post('/stores', storeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create store' };
    }
  },

  getUserRating: async (storeId) => {
    try {
      const response = await api.get(`/ratings/user-rating?storeId=${storeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user rating' };
    }
  },
};

// Blog API calls
export const blogAPI = {
  getBlogs: async (page = 1) => {
    try {
      const response = await api.get(`/blogs?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch blogs' };
    }
  },

  getBlog: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch blog' };
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create blog' };
    }
  },

  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update blog' };
    }
  },

  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete blog' };
    }
  },
}; 