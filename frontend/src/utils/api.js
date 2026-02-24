import axios from 'axios';

// ─── Base Axios Instance ─────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Leave API ───────────────────────────────────────────────
export const leaveAPI = {
  apply: (data) => api.post('/leaves', data),
  getMyLeaves: () => api.get('/leaves'),          // backend filters by role automatically
  getAllLeaves: () => api.get('/leaves'),
  updateLeave: (id, data) => api.put(`/leaves/${id}/review`, data),
  cancelLeave: (id) => api.delete(`/leaves/${id}`),
  getStats: () => api.get('/leaves/stats'),
};

// ─── User API ────────────────────────────────────────────────
export const userAPI = {
  getAll: () => api.get('/users'),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
};

export default api;
