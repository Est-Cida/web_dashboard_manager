import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// WES Lab
export const getFilters       = ()         => api.get('/filters').then(r => r.data);
export const getCategories    = ()         => api.get('/categories').then(r => r.data);
export const getQuestions     = (category) => api.get('/questions', { params: { category } }).then(r => r.data);
export const getResponse      = (params)   => api.get('/response', { params }).then(r => r.data);
export const getResponseTable = (params)   => api.get('/response/table', { params }).then(r => r.data);
export const getSummary       = (params)   => api.get('/summary', { params }).then(r => r.data);

// WES National
export const getNatFilters       = ()         => api.get('/national/filters').then(r => r.data);
export const getNatCategories    = ()         => api.get('/national/categories').then(r => r.data);
export const getNatQuestions     = (category) => api.get('/national/questions', { params: { category } }).then(r => r.data);
export const getNatResponse      = (params)   => api.get('/national/response', { params }).then(r => r.data);
export const getNatResponseTable = (params)   => api.get('/national/response/table', { params }).then(r => r.data);
export const getNatSummary       = (params)   => api.get('/national/summary', { params }).then(r => r.data);

export default api;
