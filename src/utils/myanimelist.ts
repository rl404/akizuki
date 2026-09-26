import { generateRandomStr } from './utils';

export const MAL_WEB_HOST = 'https://myanimelist.net';
export const MAL_API_HOST = 'https://api.myanimelist.net';

const stateKey = 'mal-state';
const codeChallengeKey = 'mal-code-challenge';

export const setState = (state: string) => {
  localStorage.setItem(stateKey, state);
};

export const validateState = (state: string): boolean => {
  return state === localStorage.getItem(stateKey);
};

export const deleteState = () => {
  localStorage.removeItem(stateKey);
};

export const setCodeChallenge = (code: string) => {
  localStorage.setItem(codeChallengeKey, code);
};

export const getCodeChallenge = (): string => {
  return localStorage.getItem(codeChallengeKey) || '';
};

export const deleteCodeChallenge = () => {
  localStorage.removeItem(codeChallengeKey);
};
