import { Token, User, UserAnime, UserManga } from '@/src/types';

const tokenKey = 'mal-token';
const userKey = 'mal-user';
const userAnimelistKey = 'mal-user-animelist';
const userMangalistKey = 'mal-user-mangalist';

export const saveToken = (token: Token) => {
  localStorage.setItem(tokenKey, JSON.stringify(token));
};

export const getAccessToken = (): string | undefined => {
  const t = localStorage.getItem(tokenKey);
  if (t) return JSON.parse(t).accessToken;
  return undefined;
};

export const getRefreshToken = (): string | undefined => {
  const t = localStorage.getItem(tokenKey);
  if (t) return JSON.parse(t).refreshToken;
  return undefined;
};

export const saveUser = (user: User) => {
  localStorage.setItem(userKey, JSON.stringify(user));
};

export const getUser = (): User | undefined => {
  const u = localStorage.getItem(userKey);
  if (u) return JSON.parse(u);
  return undefined;
};

export const saveUserAnimelist = (userAnimelist: UserAnime[]) => {
  localStorage.setItem(userAnimelistKey, JSON.stringify(userAnimelist));
};

export const getUserAnimelist = (): UserAnime[] | undefined => {
  const a = localStorage.getItem(userAnimelistKey);
  if (a) return JSON.parse(a);
  return undefined;
};

export const saveUserMangalist = (mangalist: UserManga[]) => {
  localStorage.setItem(userMangalistKey, JSON.stringify(mangalist));
};

export const getUserMangalist = (): UserManga[] | undefined => {
  const a = localStorage.getItem(userMangalistKey);
  if (a) return JSON.parse(a);
  return undefined;
};
