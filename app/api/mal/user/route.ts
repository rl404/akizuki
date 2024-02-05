import { MAL_API_HOST } from '@/src/utils/myanimelist';

export type Data = {
  id: number;
  name: string;
  picture: string;
  gender?: string;
  birthday?: string;
  location?: string;
  joined_at: string;
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

export async function GET(request: Request) {
  const resp = await fetch(`${MAL_API_HOST}/v2/users/@me?fields=time_zone,anime_statistics`, {
    method: 'get',
    headers: {
      Authorization: request.headers.get('authorization') || '',
    },
  });
  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
