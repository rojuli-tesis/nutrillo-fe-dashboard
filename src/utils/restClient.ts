import axios from "axios";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const post = async (url: string, data: any) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

const put = async (url: string, data: any) => {
  const response = await apiClient.put(url, data);
  return response.data;
};

// Login POST
const postWithCredentials = async (url: string, data: any) => {
  return await apiClient.post(url, data, { withCredentials: true });
};

const get = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data;
};

const patch = async <T>(url: string, data?: any) => {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
};

const restClient = {
  patch,
  post,
  put,
  get,
  postWithCredentials,
};

export default restClient;
