import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://marketplace-agre.onrender.com",
  baseURL: "http://localhost:7000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include userID in request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      if (decodedToken && decodedToken.userId) {
        // If userID exists, include it in the headers
        config.headers["user-id"] = decodedToken.userId;
      } else {
        console.error("User id not found in token.");
      }
    } else {
      console.error("Token not found in sessionStorage.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
