import axios from "axios";
import { store } from "@/store/store"; // Aapka store import karein
import { setToken, logout } from "@/store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
// Har request se pehle check karega ki token hai ya nahi
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
// Ye part sabse important hai token expire hone par refresh karne ke liye
axiosInstance.interceptors.response.use(
  (response) => response, // Agar sab sahi hai to data aane do
  async (error) => {
    const originalRequest = error.config;

    // 1. Check karein ki kya error 401 (Unauthorized) hai
    // 2. originalRequest._retry ye ensure karta hai ki hum loop mein na phas jayein
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // --- REFRESH TOKEN API CALL ---
        // Yahan direct axios use kar rahe hain axiosInstance nahi (loop se bachne ke liye)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refreshtoken`, {
          token: refreshToken, // Backend jo key expect kar raha ho (token/refreshToken)
        });

        if (response.status === 200 || response.status === 201) {
          const newAccessToken = response.data.accessToken;

          // 1. Redux Update karein
          store.dispatch(setToken({ accessToken: newAccessToken }));

          // 2. LocalStorage update karein (Optional, setToken reducer mein bhi kar sakte hain)
          localStorage.setItem("token", newAccessToken);

          // 3. Purani fail hui request ko naye token ke saath retry karein
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Agar Refresh Token bhi fail ho jaye (expire ho jaye)
        console.error("Refresh token expired or invalid", refreshError);
        store.dispatch(logout());
        window.location.href = "/login"; // User ko logout karwa ke login page pe bhejein
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;