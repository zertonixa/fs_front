import axios from "axios";

const url = "http://localhost:8000/api";

export const axiosInstance = axios.create({
  baseURL: url,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
