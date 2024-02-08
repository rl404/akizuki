import theme from '@/src/components/theme';
import {
  AnimeStatus,
  AnimeType,
  MangaStatus,
  MangaType,
  MediaType,
  UserAnimeStatus,
  UserMangaStatus,
} from '@/src/types';

export const UserAnimeStatuses: { label: string; status: UserAnimeStatus }[] = [
  { label: 'Watching', status: 'watching' },
  { label: 'Completed', status: 'completed' },
  { label: 'On-Hold', status: 'on_hold' },
  { label: 'Dropped', status: 'dropped' },
  { label: 'Plan to Watch', status: 'plan_to_watch' },
];

export const UserMangaStatuses: { label: string; status: UserMangaStatus }[] = [
  { label: 'Reading', status: 'reading' },
  { label: 'Completed', status: 'completed' },
  { label: 'On-Hold', status: 'on_hold' },
  { label: 'Dropped', status: 'dropped' },
  { label: 'Plan to Read', status: 'plan_to_read' },
];

export const UserStatusColor = (status: UserAnimeStatus | UserMangaStatus): string => {
  switch (status) {
    case 'watching':
    case 'reading':
      return theme.palette.success.main;
    case 'completed':
      return theme.palette.info.main;
    case 'on_hold':
      return theme.palette.warning.main;
    case 'dropped':
      return theme.palette.error.main;
    case 'plan_to_watch':
    case 'plan_to_read':
      return theme.palette.text.primary;
    default:
      return theme.palette.common.black;
  }
};

export const AnimeTypeStr = (type: AnimeType): string => {
  switch (type) {
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

export const MangaTypeStr = (type: MangaType): string => {
  switch (type) {
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

export const AnimeStatusStr = (s: AnimeStatus): string => {
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

export const MangaStatusStr = (s: MangaStatus): string => {
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

export const MediaTypeStr = (t: MediaType): string => {
  switch (t) {
    case 'anime':
      return 'Anime';
    case 'manga':
      return 'Manga';
    default:
      return '';
  }
};
