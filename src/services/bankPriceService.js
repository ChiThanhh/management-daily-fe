import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const upsertBankPrice = async (data) => {
    try {
        const response = await apiClient.post("/bank-price/upsert", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
