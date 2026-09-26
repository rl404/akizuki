import axios, { AxiosError } from 'axios';

export const generateRandomStr = (len: number): string => {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getAxiosError = (error: Error | AxiosError): string => {
  if (!axios.isAxiosError(error) || !error.response || !error.response.data || !error.response.data.message) {
    return error.message;
  }
  return error.response.data.message;
};
