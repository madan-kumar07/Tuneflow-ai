import axios from "axios";

const API = "http://localhost:8080/api/auth";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (loginData) => {
  const response = await axios.post(`${API}/login`, loginData);
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await axios.post(`${API}/register`, registerData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};