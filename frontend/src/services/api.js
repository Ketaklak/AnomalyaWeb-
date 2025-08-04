import axios from 'axios';

// API service for Anomalya Corp
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const prefix = (process.env.REACT_APP_API_PREFIX || '').replace(/^\/?/, '/').replace(/\/$/, '');
const API_BASE = `${BACKEND_URL.replace(/\/$/, '')}${prefix}`;

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
    (error) => Promise.reject(error)
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
  getById: (id) => api.get(`/news/${id}`),
  getCategories: () => api.get(`/news/categories/list`),
  getTags: () => api.get(`/news/tags/list`)
};

// Services API
export const servicesAPI = {
  getAll: () => api.get(`/services/`),
  getById: (id) => api.get(`/services/${id}`)
};

// Contact API
export const contactAPI = {
  create: (contactData) => api.post(`/contact/`, contactData),
  getStats: () => api.get(`/contact/stats`)
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get(`/testimonials/`)
};

// Competences API
export const competencesAPI = {
  getAll: () => api.get(`/competences/`),
  getByCategory: () => api.get(`/competences/by-category`)
};

// FAQ API
export const faqAPI = {
  getAll: () => api.get(`/faq/`)
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
  },

  // Extended Client Management
  getClients: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/clients?${queryParams.toString()}`);
  },

  addClientPoints: (clientId, points, description) => {
    return api.post(`/admin/clients/${clientId}/points?points=${points}&description=${encodeURIComponent(description)}`);
  },

  getQuotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/quotes?${queryParams.toString()}`);
  },

  updateQuote: (id, quoteData) => {
    return api.put(`/admin/quotes/${id}`, quoteData);
  },

  getSupportTickets: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/tickets?${queryParams.toString()}`);
  },

  addTicketMessage: (ticketId, message) => {
    return api.post(`/admin/tickets/${ticketId}/messages`, { message });
  },

  getClientStats: () => {
    return api.get(`/admin/stats/clients`);
  },

  // Enhanced Client Management APIs
  deleteClient: (clientId) => {
    return api.delete(`/admin/clients/${clientId}`);
  },

  updateClient: (clientId, clientData) => {
    return api.put(`/admin/clients/${clientId}`, clientData);
  },

  updateClientStatus: (clientId, isActive) => {
    return api.put(`/admin/clients/${clientId}/status`, { is_active: isActive });
  },

  getClientDetails: (clientId) => {
    return api.get(`/admin/clients/${clientId}`);
  },

  getClientActivity: (clientId) => {
    return api.get(`/admin/clients/${clientId}/activity`);
  },

  bulkUpdateClients: (clientIds, updateData) => {
    return api.put(`/admin/clients/bulk`, { client_ids: clientIds, data: updateData });
  },

  bulkDeleteClients: (clientIds) => {
    return api.delete(`/admin/clients/bulk`, { data: { client_ids: clientIds } });
  },

  // User Management APIs
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/admin/users?${queryParams.toString()}`);
  },

  createUser: (userData) => {
    return api.post(`/admin/users`, userData);
  },

  updateUser: (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData);
  },

  deleteUser: (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  updateUserStatus: (userId, isActive) => {
    return api.put(`/admin/users/${userId}/status`, { is_active: isActive });
  }
};

// Client API
export const clientAPI = {
  // Profile Management
  getProfile: () => {
    return api.get('/client/profile');
  },

  createProfile: (profileData) => {
    return api.post('/client/profile', profileData);
  },

  updateProfile: (profileData) => {
    return api.put('/client/profile', profileData);
  },

  // Dashboard
  getDashboard: () => {
    return api.get('/client/dashboard');
  },

  // Quote Requests
  createQuote: (quoteData) => {
    return api.post('/client/quotes', quoteData);
  },

  getQuotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/client/quotes?${queryParams.toString()}`);
  },

  getQuote: (quoteId) => {
    return api.get(`/client/quotes/${quoteId}`);
  },

  // Support Tickets
  createTicket: (ticketData) => {
    return api.post('/client/tickets', ticketData);
  },

  getTickets: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/client/tickets?${queryParams.toString()}`);
  },

  addTicketMessage: (ticketId, message) => {
    return api.post(`/client/tickets/${ticketId}/messages`, { ticket_id: ticketId, message });
  },

  // Points History
  getPointsHistory: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/client/points/history?${queryParams.toString()}`);
  }
};

// Analytics API
export const analyticsAPI = {
  getOverview: (timeRange = '7d') => {
    return api.get(`/admin/analytics/overview?time_range=${timeRange}`);
  },

  getUserActivity: (timeRange = '7d') => {
    return api.get(`/admin/analytics/user-activity?time_range=${timeRange}`);
  },

  getContentPerformance: (limit = 10) => {
    return api.get(`/admin/analytics/content-performance?limit=${limit}`);
  },

  getTrafficSources: (timeRange = '7d') => {
    return api.get(`/admin/analytics/traffic-sources?time_range=${timeRange}`);
  },

  getPopularPages: (limit = 10) => {
    return api.get(`/admin/analytics/popular-pages?limit=${limit}`);
  },

  exportAnalytics: (timeRange = '30d', format = 'json') => {
    return api.get(`/admin/analytics/export?time_range=${timeRange}&format=${format}`);
  }
};

// Media API
export const mediaAPI = {
  getFiles: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/media/files?${queryParams.toString()}`);
  },

  uploadFiles: (files, folder = '') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);
    
    return api.post('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadBase64: (imageData, filename = 'image', folder = '') => {
    const formData = new FormData();
    formData.append('image_data', imageData);
    formData.append('filename', filename);
    formData.append('folder', folder);
    
    return api.post('/admin/media/upload-base64', formData);
  },

  deleteFile: (fileId) => {
    return api.delete(`/admin/media/files/${fileId}`);
  },

  createFolder: (name, parent = '') => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('parent', parent);
    
    return api.post('/admin/media/folders', formData);
  },

  getFolders: (parent = '') => {
    return api.get(`/admin/media/folders?parent=${parent}`);
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/notifications/?${queryParams.toString()}`);
  },

  getUnreadCount: () => {
    return api.get('/admin/notifications/unread-count/');
  },

  markAsRead: (notificationId) => {
    return api.put(`/admin/notifications/${notificationId}/read/`);
  },

  markAllAsRead: () => {
    return api.put('/admin/notifications/mark-all-read/');
  },

  delete: (notificationId) => {
    return api.delete(`/admin/notifications/${notificationId}/`);
  },

  deleteOld: (days = 30) => {
    return api.delete(`/admin/notifications/?days=${days}`);
  },

  create: (type, title, message, link = null) => {
    return api.post('/admin/notifications/', {
      type,
      title,
      message,
      link
    });
  }
};

export default api;