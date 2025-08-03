// API service for Anomalya Corp
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper function for API calls
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// News API
export const newsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `${API}/news/?${queryParams.toString()}`;
    return apiCall(url);
  },

  getById: (id) => {
    return apiCall(`${API}/news/${id}`);
  },

  getCategories: () => {
    return apiCall(`${API}/news/categories/list`);
  },

  getTags: () => {
    return apiCall(`${API}/news/tags/list`);
  }
};

// Services API
export const servicesAPI = {
  getAll: () => {
    return apiCall(`${API}/services/`);
  },

  getById: (id) => {
    return apiCall(`${API}/services/${id}`);
  }
};

// Contact API
export const contactAPI = {
  create: (contactData) => {
    return apiCall(`${API}/contact/`, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  getStats: () => {
    return apiCall(`${API}/contact/stats`);
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => {
    return apiCall(`${API}/testimonials/`);
  }
};

// Competences API
export const competencesAPI = {
  getAll: () => {
    return apiCall(`${API}/competences/`);
  },

  getByCategory: () => {
    return apiCall(`${API}/competences/by-category`);
  }
};

// FAQ API
export const faqAPI = {
  getAll: () => {
    return apiCall(`${API}/faq/`);
  }
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => {
    return apiCall(`${API}/newsletter/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  unsubscribe: (email) => {
    return apiCall(`${API}/newsletter/unsubscribe`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getStats: () => {
    return apiCall(`${API}/newsletter/stats`);
  }
};

export default {
  news: newsAPI,
  services: servicesAPI,
  contact: contactAPI,
  testimonials: testimonialsAPI,
  competences: competencesAPI,
  faq: faqAPI,
  newsletter: newsletterAPI
};