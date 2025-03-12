import axios from "axios";

const apiRequest = axios.create({
  //baseURL: "http://localhost:8800/api",
  //baseURL: "https://pfe-56gpback.vercel.app/",
  baseURL: `${import.meta.env.VITE_BACK_END_URL}`,
  withCredentials: true,
});

export default apiRequest;
