import { MangaStatus, MangaType, UserMangaStatus } from '@/src/types';
import { MAL_API_HOST } from '@/src/utils/myanimelist';

export type Data = {
  data: {
    node: MangaData;
  }[];
};

export type MangaData = {
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
  status: MangaStatus;
  nsfw: string;
  media_type: MangaType;
  num_volumes: number;
  num_chapters: number;
  my_list_status: {
    status: UserMangaStatus;
    score: number;
    num_volumes_read: number;
    num_chapters_read: number;
    is_rereading: boolean;
    start_date: string;
    finish_date: string;
    priority: number;
    num_times_reread: number;
    reread_value: number;
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
    'num_volumes',
    'num_chapters',
    'status',
    'nsfw',
    'my_list_status{num_times_reread,reread_value,tags,comments}',
  ];

  const resp = await fetch(
    `${MAL_API_HOST}/v2/manga?q=${query}&offset=${offset}&limit=${limit}&fields=${fields.join(',')}&nsfw=true`,
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
