import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function PUT(request: Request) {
  const { id, episode, completed, watching, todayStart, todayEnd } = await request.json();

  var body = new URLSearchParams({
    num_watched_episodes: episode,
  });

  const today = new Date();

  !!watching && body.set('status', 'watching');
  !!completed && body.set('status', 'completed');
  !!todayStart && body.set('start_date', today.toISOString().slice(0, 10));
  !!todayEnd && body.set('finish_date', today.toISOString().slice(0, 10));

  const resp = await fetch(`${MAL_API_HOST}/v2/anime/${id}/my_list_status`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: request.headers.get('authorization') || '',
    },
    body: body,
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
