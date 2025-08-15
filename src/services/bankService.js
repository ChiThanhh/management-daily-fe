import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createBank = async (data) => {
    try {
        const response = await apiClient.post("/banks", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getAllBank = async () => {
    try {
        const response = await apiClient.get("/banks");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const updateBank = async (id, data) => {
    try {
        const response = await apiClient.put(`/banks/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const deleteBank = async (id) => {
    try {
        const response = await apiClient.delete(`/banks/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

