import axios from 'axios';

const API_URL = '/api';
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

export const login = (data: LoginData) => axios.post(`${API_URL}/users/login`, data);
export const register = (data: RegisterData) => axios.post(`${API_URL}/users/register`, data);
export const getProfile = (id: string) => axios.get(`${API_URL}/users/${id}`);