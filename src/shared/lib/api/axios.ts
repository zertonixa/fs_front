import axios from "axios";

const url = process.env.API_URL;

export const axiosInstance = axios.create({
  baseURL: url,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
