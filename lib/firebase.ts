import axios from 'axios';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { defaultFormula } from './storage';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIAL || '{}');

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const saveFormula = async (username: string, type: string, formula: string): Promise<void> => {
  await axios.post(`api/firebase/formula/${username}/${type}`, {
    formula: formula,
  });
};

export const saveAnimeFormula = async (username: string, formula: string): Promise<void> => {
  await saveFormula(username, 'anime', formula);
};

export const saveMangaFormula = async (username: string, formula: string): Promise<void> => {
  await saveFormula(username, 'manga', formula);
};

const getFormula = async (username: string, type: string): Promise<string> => {
  return await axios
    .get(`api/firebase/formula/${username}/${type}`)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return defaultFormula;
    });
};

export const getAnimeFormula = async (username: string): Promise<string> => {
  return await getFormula(username, 'anime');
};

export const getMangaFormula = async (username: string): Promise<string> => {
  return await getFormula(username, 'manga');
};
