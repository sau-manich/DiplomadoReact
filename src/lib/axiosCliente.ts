import axios from 'axios';
import { env } from '../config/env';

export const axiosClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
