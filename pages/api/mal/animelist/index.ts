// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_MAL_HOST } from '../../../../lib/myanimelist';

export type Data = Array<AnimelistData>;

type AnimelistData = {
  node: {
    id: number;
    title: string;
    main_picture: {
      large: string;
      medium: string;
    };
    mean: number;
    rank: number;
    popularity: number;
    synopsis: string;
    genres: Array<{
      id: number;
      name: string;
    }>;
    status: string;
    media_type: string;
    num_episodes: number;
  };
  list_status: {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    start_date: string;
    finish_date: string;
    priority: number;
    num_times_rewatched: number;
    rewatched_value: number;
    tags: Array<string>;
    comments: string;
    updated_at: Date;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const limit = 900;
  var offset = 0;

  var list: Array<AnimelistData> = [];

  while (true) {
    const resp = await fetch(
      `${API_MAL_HOST}/v2/users/@me/animelist?limit=${
        limit + 1
      }&offset=${offset}&nsfw=true&fields=rank,mean,popularity,synopsis,genres,media_type,num_episodes,status,list_status{num_times_rewatched,rewatch_value,tags,comments}`,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
        method: req.method,
      },
    );

    if (resp.status !== 200) {
      res.status(resp.status).json([]);
      return;
    }

    const data = await resp.json();

    if (data.data.length == 0) {
      break;
    }

    list = [...list, ...data.data];

    if (data.data.length <= limit) {
      break;
    } else {
      list.pop();
    }

    offset += limit;
  }

  res.status(200).json(list);
}
