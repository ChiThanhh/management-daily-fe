import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const addExpense = async (data) => {
    try {
        const response = await apiClient.post("/employee-expense", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getMonthlyExpenses = async () => {
    try {
        const response = await apiClient.get("/employee-expense/monthly");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
