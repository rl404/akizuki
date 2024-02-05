import { AnimeStatus, AnimeType, UserAnimeStatus } from '@/src/types';
import { MAL_API_HOST } from '@/src/utils/myanimelist';

export type Data = {
  data: {
    node: AnimeData;
  }[];
};

export type AnimeData = {
  id: number;
  title: string;
  main_picture: {
    large: string;
    medium: string;
  };
  alternative_titles: {
    synonyms: string[];
    en: string;
    ja: string;
  };
  mean: number;
  rank: number;
  popularity: number;
  synopsis: string;
  genres: {
    id: number;
    name: string;
  }[];
  status: AnimeStatus;
  nsfw: string;
  media_type: AnimeType;
  num_episodes: number;
  my_list_status: {
    status: UserAnimeStatus;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    start_date: string;
    finish_date: string;
    priority: number;
    num_times_rewatched: number;
    rewatched_value: number;
    tags: string[];
    comments: string;
    updated_at: string;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const offset = searchParams.get('offset') || '';
  const limit = searchParams.get('limit') || '';

  const fields = [
    'alternative_titles',
    'rank',
    'mean',
    'popularity',
    'synopsis',
    'genres',
    'media_type',
    'num_episodes',
    'status',
    'nsfw',
    'my_list_status{num_times_rewatched,rewatch_value,tags,comments}',
  ];

  const resp = await fetch(
    `${MAL_API_HOST}/v2/anime?q=${query}&offset=${offset}&limit=${limit}&fields=${fields.join(',')}&nsfw=true`,
    {
      method: 'get',
      headers: {
        Authorization: request.headers.get('authorization') || '',
      },
    },
  );

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
