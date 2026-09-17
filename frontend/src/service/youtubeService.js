import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

const API_URL = `${API_BASE_URL}/api/youtube`;

export const searchVideos = async (query) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { query }
    });

    return response.data;
};