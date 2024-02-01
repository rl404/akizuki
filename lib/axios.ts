import axios from 'axios';
import { useRouter } from 'next/router';
import { Data } from '../pages/api/mal/oauth2/refresh';
import { getAccessToken, getRefreshToken, saveToken } from './storage';

export const akizukiAxios = axios.create();

akizukiAxios.interceptors.request.use(
  async (config) => {
    config && config.headers && (config.headers.authorization = `Bearer ${getAccessToken()}`);
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

akizukiAxios.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    const originalRequest = error.config;
    if (originalRequest._retry || error.response.status !== 401) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    return axios
      .post(`/api/mal/oauth2/refresh?refresh_token=${getRefreshToken()}`, null)
      .then((resp) => {
        const data: Data = resp.data;

        saveToken({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        return akizukiAxios(originalRequest);
      })
      .catch((err) => {
        localStorage.clear();
        if (err.response && err.response.status === 401) {
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
        return Promise.reject(error);
      });
  },
);
