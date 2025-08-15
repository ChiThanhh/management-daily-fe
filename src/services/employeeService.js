import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createEmployee = async (data) => {
    try {
        const response = await apiClient.post("/employees", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getAllEmployee = async () => {
    try {
        const response = await apiClient.get("/employees");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const updateEmployee = async (id, data) => {
    try {
        const response = await apiClient.put(`/employees/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const deleteEmployee = async (id) => {
    try {
        const response = await apiClient.delete(`/employees/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

