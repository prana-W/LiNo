import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    withCredentials: true,
});

export default api;
