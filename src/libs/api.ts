import axios from 'axios';
import { appStoreContext } from '@/stores';

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const instance = () => {
  const instance = axios.create({ baseURL, withCredentials: true });
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error?.response?.data?.resultMessage) {
        Object.assign(error, {
          message: error.response.data.resultMessage,
        });
      }
      return Promise.reject(error);
    },
  );
  return instance;
};

export const publicApi = instance();

export const authApi = instance();

authApi.interceptors.request.use(
  async function (config) {
    const session = appStoreContext.getState()?.session;
    const token = session?.user.token;

    if (token) {
      config.headers.set({
        Authorization: `Bearer ${token.accessToken}`,
      });
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  },
);
