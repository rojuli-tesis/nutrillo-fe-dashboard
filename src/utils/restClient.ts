import axios from "axios";

const baseURL = "http://localhost:3000";

const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const post = async (url: string, data: any) => {
  const response = await instance.post(url, data);
  return response.data;
};

const put = async (url: string, data: any) => {
  const response = await instance.put(url, data);
  return response.data;
};

// Login POST
const postWithCredentials = async (url: string, data: any) => {
  const response = await instance.post(url, data, { withCredentials: true });
  return response.data;
};

const get = async <T>(url: string): Promise<T> => {
  const response = await instance.get<T>(url);
  return response.data;
};

const restClient = {
  post,
  put,
  get,
  postWithCredentials,
};

export default restClient;
