export type UserAnime = {
  id: number;
  title: string;
  picture: string;
  rank: number;
  score: number;
  popularity: number;
  status: string;
  episode: number;
  synopsis: string;
  genres: Array<string>;
  mediaType: string;
  nsfw: boolean;
  userStatus: string;
  userScore: number;
  userEpisode: number;
  userStartDate: string;
  userEndDate: string;
  tags: Array<string>;
  comments: string;
};

export type UserManga = {
  id: number;
  title: string;
  picture: string;
  rank: number;
  score: number;
  popularity: number;
  status: string;
  chapter: number;
  volume: number;
  synopsis: string;
  genres: Array<string>;
  mediaType: string;
  nsfw: boolean;
  userStatus: string;
  userScore: number;
  userChapter: number;
  userVolume: number;
  userStartDate: string;
  userEndDate: string;
  tags: Array<string>;
  comments: string;
};

export type User = {
  username: string;
  picture: string;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};
