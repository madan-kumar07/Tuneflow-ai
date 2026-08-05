import axios from "axios";

const API_URL = "http://10.236.118.138:8080/api/youtube";

export const searchVideos = async (query) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { query }
    });

    return response.data;
};