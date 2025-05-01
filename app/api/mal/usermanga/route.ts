import { MangaData } from '@/app/api/mal/manga/route';
import { MAL_API_HOST } from '@/src/utils/myanimelist';

export type Data = {
  data: {
    node: MangaData;
  }[];
};

export async function GET(request: Request) {
  const limit = 900;
  let offset = 0;
  let userManga: { node: MangaData }[] = [];

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

  while (true) {
    const resp = await fetch(
      `${MAL_API_HOST}/v2/users/@me/mangalist?limit=${limit + 1}&offset=${offset}&nsfw=true&fields=${fields.join(',')}`,
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

    userManga = [...userManga, ...data.data];

    if (data.data.length <= limit) {
      break;
    }

    userManga.pop();

    offset += limit;
  }

  return Response.json({ data: userManga });
}
