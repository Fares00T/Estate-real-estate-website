import axios from "axios";

const apiRequest = axios.create({
  //baseURL: "http://localhost:8800/api",
  baseURL: "https://pfe-56gpback.vercel.app/",
  withCredentials: true,
});

export default apiRequest;
