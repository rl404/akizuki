import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function PUT(request: Request) {
  const { id, chapter, volume, completed, reading, todayStart, todayEnd } = await request.json();

  const body = new URLSearchParams({
    num_chapters_read: chapter,
    num_volumes_read: volume,
  });

  const today = new Date();

  if (!!reading) body.set('status', 'reading');
  if (!!completed) body.set('status', 'completed');
  if (!!todayStart) body.set('start_date', today.toISOString().slice(0, 10));
  if (!!todayEnd) body.set('finish_date', today.toISOString().slice(0, 10));

  const resp = await fetch(`${MAL_API_HOST}/v2/manga/${id}/my_list_status`, {
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
