import axios from "axios";
import { API_URI } from "./constants";

const axiosInstance = axios.create({
    baseURL: API_URI,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
