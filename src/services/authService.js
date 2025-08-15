import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Hàm gọi API đăng nhập
export const login = async (data) => {
    try {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

