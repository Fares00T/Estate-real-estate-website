import axios from "axios";

const apiRequest = axios.create({
  //baseURL: "http://localhost:8800/api",
  baseURL: "https://pfe-vnum.onrender.com"
  withCredentials: true,
});

export default apiRequest;
