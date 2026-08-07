import axios from "axios";

const API = "http://localhost:8080/auth";

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