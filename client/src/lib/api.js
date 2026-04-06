import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getFilters = () => api.get('/filters').then(r => r.data);
export const getCategories = () => api.get('/categories').then(r => r.data);
export const getQuestions = (category) => api.get('/questions', { params: { category } }).then(r => r.data);
export const getResponse = (params) => api.get('/response', { params }).then(r => r.data);
export const getResponseTable = (params) => api.get('/response/table', { params }).then(r => r.data);
export const getSummary = (params) => api.get('/summary', { params }).then(r => r.data);

export default api;
