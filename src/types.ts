export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  username: string;
  picture: string;
  gender: string;
  birthday: string;
  location: string;
  joinedAt: string;
  animeStatistics: {
    numItemsWatching: number;
    numItemsCompleted: number;
    numItemsOnHold: number;
    numItemsDropped: number;
    numItemsPlanToWatch: number;
    numItems: number;
    numDaysWatched: number;
    numDaysWatching: number;
    numDaysCompleted: number;
    numDaysOnHold: number;
    numDaysDropped: number;
    numDays: number;
    numEpisodes: number;
    numTimesRewatched: number;
    meanScore: number;
  };
  timeZone: string;
  isSupporter: boolean;
};

export type UserAnime = {
  id: number;
  title: string;
  picture: string;
  synonyms: string[];
  enTitle: string;
  jpTitle: string;
  rank: number;
  score: number;
  popularity: number;
  status: AnimeStatus;
  episode: number;
  synopsis: string;
  genres: string[];
  mediaType: AnimeType;
  nsfw: boolean;
  userStatus: UserAnimeStatus;
  userScore: number;
  userEpisode: number;
  userStartDate: string;
  userEndDate: string;
  tags: string[];
  comments: string;
};

export type UserManga = {
  id: number;
  title: string;
  picture: string;
  synonyms: string[];
  enTitle: string;
  jpTitle: string;
  rank: number;
  score: number;
  popularity: number;
  status: MangaStatus;
  chapter: number;
  volume: number;
  synopsis: string;
  genres: string[];
  mediaType: MangaType;
  nsfw: boolean;
  userStatus: UserMangaStatus;
  userScore: number;
  userChapter: number;
  userVolume: number;
  userStartDate: string;
  userEndDate: string;
  tags: string[];
  comments: string;
};

export type Layout = 'card' | 'cover' | 'list';

export type UserAnimeStatus = '' | 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';

export type UserMangaStatus = '' | 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export type MediaType = 'anime' | 'manga';

export type AnimeStatus = 'finished_airing' | 'currently_airing' | 'not_yet_aired';

export type MangaStatus = 'finished' | 'currently_publishing' | 'not_yet_published' | 'on_hiatus' | 'discontinued';

export type AnimeType = 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';

export type MangaType = 'manga' | 'novel' | 'one_shot' | 'doujinshi' | 'manhwa' | 'manhua' | 'oel' | 'light_novel';
