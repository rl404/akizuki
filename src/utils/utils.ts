import axios, { AxiosError } from 'axios';

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomStr = (len: number): string => {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getAxiosError = (error: Error | AxiosError): string => {
  if (!axios.isAxiosError(error) || !error.response || !error.response.data || !error.response.data.message) {
    return error.message;
  }
  return error.response.data.message;
};
