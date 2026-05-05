import axios from "axios";

/* ================= API INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://reciple-backend.onrender.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

/* ================= AUTH API ================= */

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

/* ================= RECIPE API ================= */

export const recipeAPI = {
  getAll: (params) => api.get("/recipes", { params }),
  getOne: (slug) => api.get(`/recipes/${slug}`),
  getFeatured: () => api.get("/recipes/featured"),
  getTags: () => api.get("/recipes/tags"),
  getMy: (params) => api.get("/recipes/my", { params }),
  getSimilar: (id) => api.get(`/recipes/${id}/similar`),

  create: (data) => api.post("/recipes", data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),

  addReview: (id, data) => api.post(`/recipes/${id}/reviews`, data),
  toggleSave: (id) => api.post(`/recipes/${id}/save`),
};

/* ================= USER API ================= */

export const userAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
  getSaved: () => api.get("/users/saved"),
};

/* ================= UPLOAD API ================= */

export const uploadAPI = {
  upload: (formData) =>
    api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  delete: (filename) => api.delete(`/upload/${filename}`),
};