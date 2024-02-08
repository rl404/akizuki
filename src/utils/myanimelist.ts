import { generateRandomStr } from './utils';

export const MAL_WEB_HOST = 'https://myanimelist.net';
export const MAL_API_HOST = 'https://api.myanimelist.net';

const stateKey = 'mal-state';
const codeChallengeKey = 'mal-code-challenge';

const generateState = (): string => {
  const state = generateRandomStr(20);
  localStorage.setItem(stateKey, state);
  return state;
};

export const validateState = (state: string): boolean => {
  return state === localStorage.getItem(stateKey);
};

export const deleteState = () => {
  localStorage.removeItem(stateKey);
};

const generateCodeChallenge = (): string => {
  const code = generateRandomStr(100);
  localStorage.setItem(codeChallengeKey, code);
  return code;
};

export const getCodeChallenge = (): string => {
  return localStorage.getItem(codeChallengeKey) || '';
};

export const deleteCodeChallenge = () => {
  localStorage.removeItem(codeChallengeKey);
};

export const generateMalOauthURL = () => {
  const clientID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;
  const redirectURI = process.env.NEXT_PUBLIC_MAL_REDIRECT_URI;
  const state = generateState();
  const codeChallenge = generateCodeChallenge();
  return `${MAL_WEB_HOST}/v1/oauth2/authorize?response_type=code&client_id=${clientID}&state=${state}&code_challenge=${codeChallenge}&redirect_uri=${redirectURI}`;
};
