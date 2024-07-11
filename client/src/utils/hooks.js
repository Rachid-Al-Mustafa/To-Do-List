import { axiosInstance } from './api';

export const userAction = async (action) => {
  const { data } = await axiosInstance.post('/analytics/analytics', action);
  return data;
};

export const fetchAnalytics = async () => {
  const { data } = await axiosInstance.get('/analytics/dataAnalytics');
  return data;
};

export const fetchTaskAnalytics = async () => {
  const { data } = await axiosInstance.get('/task/getTaskAnalytics');
  return data;
};

export const fetchUserTasks = async () => {
  const { data } = await axiosInstance.get('/analytics/userTasks');
  return data;
}

export const fetchTasks = async () => {
  const { data } = await axiosInstance.get('/task/tasksList');
  return data;
};

export const addTask = async (task) => {
  const { data } = await axiosInstance.post('/task/newTask', task);
  return data;
};

export const editTask = async ({ id, task }) => {
  const { data } = await axiosInstance.post(`/task/editTask/${id}`, task);
  return data;
};

export const updateTaskStatus = async ({ taskId, newStatus }) => {
  const { data } = await axiosInstance.post(`/task/updateStatus`, {
    taskId,
    newStatus,
  });
  return data;
};

export const deleteTask = async (ids) => {
  const { data } = await axiosInstance.post(`/task/removeTasks`, ids);
  return data;
};

export const allUsers = async () => {
  const { data } = await axiosInstance.get('/user/users');
  return data;
}

export const deleteUser = async (ids) => {
  const { data } = await axiosInstance.post('/user/deleteUsers', ids);
  return data;
}

export const checkUser = async (credentials) => {
  const { data } = await axiosInstance.post('/login', credentials);
  localStorage.setItem('authToken', data.token);
  return data;
};

export const addUser = async (credentials) => {
  const { data } = await axiosInstance.post('/register', credentials);
    localStorage.setItem('user', data);
    console.log(data);
  localStorage.setItem('authToken', data.token);
  return data;
};

export const editUser = async (credentials) => {
  const { data } = await axiosInstance.post('/user/edit-user', credentials);
  return data;
};

export const editUserRole = async (credentials) => {
  const { data } = await axiosInstance.post('/user/change-role', credentials);
  return data;
};

export const addNewUser = async (credentials) => {
  const { data } = await axiosInstance.post('/register', credentials);
  return data;
};

export const signoutUser = async (id) => {
  console.log(id);
  const { data } = await axiosInstance.post('/logout', id);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  return data;
};