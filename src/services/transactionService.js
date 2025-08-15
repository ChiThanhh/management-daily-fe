import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const calculatePrices = async (data) => {
    try {
        const response = await apiClient.post("/transactions", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAllTotalList = async () => {
    try {
        const response = await apiClient.get("/transactions/daily-totals");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getMonthlyIncome = async () => {
    try {
        const response = await apiClient.get("/transactions/monthly-income");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
