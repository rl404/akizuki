import { generateRandomStr } from './utils';

export const WEB_MAL_HOST = 'https://myanimelist.net';
export const API_MAL_HOST = 'https://api.myanimelist.net';

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
  return `${WEB_MAL_HOST}/v1/oauth2/authorize?response_type=code&client_id=${clientID}&state=${state}&code_challenge=${codeChallenge}&redirect_uri=${redirectURI}`;
};

export const animeTypeToStr = (t: string): string => {
  switch (t) {
    case 'tv':
      return 'TV';
    case 'ova':
      return 'OVA';
    case 'movie':
      return 'Movie';
    case 'special':
      return 'Special';
    case 'ona':
      return 'ONA';
    case 'music':
      return 'Music';
    default:
      return '-';
  }
};

export const mangaTypeToStr = (t: string): string => {
  switch (t) {
    case 'manga':
      return 'Manga';
    case 'novel':
      return 'Novel';
    case 'one_shot':
      return 'One-Shot';
    case 'doujinshi':
      return 'Doujinshi';
    case 'manhwa':
      return 'Manhwa';
    case 'manhua':
      return 'Manhua';
    case 'oel':
      return 'OEL';
    case 'light_novel':
      return 'Light Novel';
    default:
      return '-';
  }
};

export const animeStatusToStr = (s: string): string => {
  switch (s) {
    case 'finished_airing':
      return 'Finished Airing';
    case 'currently_airing':
      return 'Airing';
    case 'not_yet_aired':
      return 'Not Yet Aired';
    default:
      return '-';
  }
};

export const mangaStatusToStr = (s: string): string => {
  switch (s) {
    case 'finished':
      return 'Finished';
    case 'currently_publishing':
      return 'Publishing';
    case 'not_yet_published':
      return 'Not Yet Published';
    case 'on_hiatus':
      return 'On Hiatus';
    case 'discontinued':
      return 'Discontinued';
    default:
      return '-';
  }
};
