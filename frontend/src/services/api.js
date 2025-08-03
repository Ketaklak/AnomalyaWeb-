import axios from 'axios';

// API service for Anomalya Corp
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE}/auth/refresh-token`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token } = response.data;
          localStorage.setItem('token', access_token);
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// News API
export const newsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.sort) queryParams.append('sort', params.sort);
    
    return api.get(`/news/?${queryParams.toString()}`);
  },

  getById: (id) => {
    return api.get(`/news/${id}`);
  },

  getCategories: () => {
    return api.get(`/news/categories/list`);
  },

  getTags: () => {
    return api.get(`/news/tags/list`);
  }
};

// Services API
export const servicesAPI = {
  getAll: () => {
    return api.get(`/services/`);
  },

  getById: (id) => {
    return api.get(`/services/${id}`);
  }
};

// Contact API
export const contactAPI = {
  create: (contactData) => {
    return api.post(`/contact/`, contactData);
  },

  getStats: () => {
    return api.get(`/contact/stats`);
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => {
    return api.get(`/testimonials/`);
  }
};

// Competences API
export const competencesAPI = {
  getAll: () => {
    return api.get(`/competences/`);
  },

  getByCategory: () => {
    return api.get(`/competences/by-category`);
  }
};

// FAQ API
export const faqAPI = {
  getAll: () => {
    return api.get(`/faq/`);
  }
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => {
    return api.post(`/newsletter/subscribe`, { email });
  },

  unsubscribe: (email) => {
    return api.post(`/newsletter/unsubscribe`, { email });
  },

  getStats: () => {
    return api.get(`/newsletter/stats`);
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => {
    return api.post(`/auth/login`, credentials);
  },

  register: (userData) => {
    return api.post(`/auth/register`, userData);
  },

  me: () => {
    return api.get(`/auth/me`);
  },

  refreshToken: () => {
    return api.post(`/auth/refresh-token`);
  },

  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/auth/users?${queryParams.toString()}`);
  },

  getStats: () => {
    return api.get(`/auth/stats`);
  }
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => {
    return api.get(`/admin/dashboard/stats`);
  },

  // Articles
  getArticles: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/articles?${queryParams.toString()}`);
  },

  createArticle: (articleData) => {
    return api.post(`/admin/articles`, articleData);
  },

  updateArticle: (id, articleData) => {
    return api.put(`/admin/articles/${id}`, articleData);
  },

  deleteArticle: (id) => {
    return api.delete(`/admin/articles/${id}`);
  },

  // Contacts
  getContacts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/contacts?${queryParams.toString()}`);
  },

  // Services
  getServices: () => {
    return api.get(`/admin/services`);
  },

  createService: (serviceData) => {
    return api.post(`/admin/services`, serviceData);
  },

  // Testimonials
  getTestimonials: () => {
    return api.get(`/admin/testimonials`);
  },

  createTestimonial: (testimonialData) => {
    return api.post(`/admin/testimonials`, testimonialData);
  }
};

export default api;