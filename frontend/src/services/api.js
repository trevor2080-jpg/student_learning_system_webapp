import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Students
export const studentsApi = {
  getAll: () => api.get('/students').then(r => r.data),
  getOne: (id) => api.get(`/students/${id}`).then(r => r.data),
  create: (data) => api.post('/students', data).then(r => r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Profiles
export const profilesApi = {
  getAll: () => api.get('/profiles').then(r => r.data),
  getOne: (id) => api.get(`/profiles/${id}`).then(r => r.data),
  create: (data) => api.post('/profiles', data).then(r => r.data),
  update: (id, data) => api.put(`/profiles/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/profiles/${id}`),
};

// Courses
export const coursesApi = {
  getAll: () => api.get('/courses').then(r => r.data),
  getOne: (id) => api.get(`/courses/${id}`).then(r => r.data),
  create: (data) => api.post('/courses', data).then(r => r.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Assignments
export const assignmentsApi = {
  getAll: () => api.get('/assignments').then(r => r.data),
  getOne: (id) => api.get(`/assignments/${id}`).then(r => r.data),
  create: (data) => api.post('/assignments', data).then(r => r.data),
  update: (id, data) => api.put(`/assignments/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Enrollments
export const enrollmentsApi = {
  getAll: () => api.get('/enrollments').then(r => r.data),
  enroll: (studentId, courseId) =>
    api.post(`/enrollments/${studentId}/courses/${courseId}`).then(r => r.data),
  unenroll: (studentId, courseId) =>
    api.delete(`/enrollments/${studentId}/courses/${courseId}`).then(r => r.data),
};

export default api;
