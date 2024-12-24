import axios from "axios";
import { API_SERVER_HOST } from "../../common/api/mainApi";

const API_BASE_URL = `${API_SERVER_HOST}/community`;

export const createPost = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

export const updatePost = async (id, formData) => {
  const response = await axios.put(`${API_BASE_URL}/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/posts/${id}`);
  return response.data;
};
