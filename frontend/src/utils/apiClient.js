import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from '../store/store.js';
import { logout } from "../store/authSlice";

// Create a reusable axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Important for cookies (refresh token etc.)
});

// Interceptor setup to handle automatic logout on 401
export const apiFunc = () => {
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                const currentPath = window.location.pathname;
                toast.error("Session expired. Please log in again.");
                store.dispatch(logout());
                // Redirect to homepage/login after short delay
                if (currentPath !== "/") {
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
            }
            return Promise.reject(error);
        }
    );
    return apiClient;
};

export default apiClient;
