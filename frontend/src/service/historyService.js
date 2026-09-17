import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

const API_URL = `${API_BASE_URL}/api/history`;

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getHistory = async () => {
  const response = await axios.get(API_URL, {
    headers: getHeaders(),
  });

  return response.data;
};

export const clearHistory = async () => {
  const response = await axios.delete(API_URL, {
    headers: getHeaders(),
  });

  return response.data;
};

export const addToHistory = async (song) => {
  const response = await axios.post(API_URL, song, {
    headers: getHeaders(),
  });

  return response.data;
};