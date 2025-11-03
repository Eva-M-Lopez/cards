import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

export const apiClient = {
  login: async (login: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, { login, password });
    return response.data;
  },
  signup: async (userData: {
    firstName: string,
    lastName: string,
    login: string,
    password: string,
    email: string
  }) => {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  },
  verify: async (login: string, verificationCode: string) => {
    const response = await axios.post(`${BASE_URL}/verify`, { login, verificationCode });
    return response.data;
  },
  addCard: async (userId: number, card: string) => {
    const response = await axios.post(`${BASE_URL}/addcard`, { userId, card });
    return response.data;
  },
  searchCards: async (userId: number, search: string) => {
    const response = await axios.post(`${BASE_URL}/searchcards`, { userId, search });
    return response.data;
  },
};