import { AnimeData } from '@/app/api/mal/anime/route';
import { MAL_API_HOST } from '@/src/utils/myanimelist';

export type Data = {
  data: {
    node: AnimeData;
  }[];
};

export async function GET(request: Request) {
  const limit = 900;
  let offset = 0;
  let userAnime: { node: AnimeData }[] = [];

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

  while (true) {
    const resp = await fetch(
      `${MAL_API_HOST}/v2/users/@me/animelist?limit=${limit + 1}&offset=${offset}&nsfw=true&fields=${fields.join(',')}`,
      {
        method: 'get',
        headers: {
          Authorization: request.headers.get('authorization') || '',
        },
      },
    );

    const data = await resp.json();

    if (resp.status !== 200) {
      return Response.json(data, { status: resp.status });
    }

    userAnime = [...userAnime, ...data.data];

    if (data.data.length <= limit) {
      break;
    }

    userAnime.pop();

    offset += limit;
  }

  return Response.json({ data: userAnime });
}
