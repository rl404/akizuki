// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_MAL_HOST } from '../../../lib/myanimelist';

export type Data = {
  id: number;
  name: string;
  picture: string;
  gender?: string;
  birthday?: string;
  location?: string;
  joined_at: Date;
  anime_statistics?: {
    num_items_watching: number;
    num_items_completed: number;
    num_items_on_hold: number;
    num_items_dropped: number;
    num_items_plan_to_watch: number;
    num_items: number;
    num_days_watched: number;
    num_days_watching: number;
    num_days_completed: number;
    num_days_on_hold: number;
    num_days_dropped: number;
    num_days: number;
    num_episodes: number;
    num_times_rewatched: number;
    mean_score: number;
  };
  time_zone?: string;
  is_supporter?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(`${API_MAL_HOST}/v2/users/@me?fields=time_zone,anime_statistics`, {
    headers: {
      Authorization: req.headers.authorization || '',
    },
    method: req.method,
  });
  const data = await resp.json();
  res.status(resp.status).json(data);
}
