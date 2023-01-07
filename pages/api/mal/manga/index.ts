// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_MAL_HOST } from '../../../../lib/myanimelist';

export type Data = {
  data: Array<{
    node: Manga;
  }>;
};

export type Manga = {
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
  nsfw: string;
  media_type: string;
  num_volumes: number;
  num_chapters: number;
  my_list_status: {
    status: string;
    score: number;
    num_volumes_read: number;
    num_chapters_read: number;
    is_rereading: boolean;
    start_date: string;
    finish_date: string;
    priority: number;
    num_times_reread: number;
    reread_value: number;
    tags: Array<string>;
    comments: string;
    updated_at: Date;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { query, offset, limit } = req.query;

  const fields = [
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
    `${API_MAL_HOST}/v2/manga?q=${query}&offset=${offset}&limit=${limit}&fields=${fields.join(',')}&nsfw=true`,
    {
      headers: {
        Authorization: req.headers.authorization || '',
      },
      method: req.method,
    },
  );
  const data = await resp.json();
  res.status(resp.status).json(data);
}
