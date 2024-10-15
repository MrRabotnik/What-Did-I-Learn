import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://whatdidilearn.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
