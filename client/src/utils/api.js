import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { setAuthToken, axiosInstance };
