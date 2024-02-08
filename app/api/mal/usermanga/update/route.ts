import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function PUT(request: Request) {
  const { id, status, score, chapter, volume, startDate, endDate, comment, tags } = await request.json();

  const resp = await fetch(`${MAL_API_HOST}/v2/manga/${id}/my_list_status`, {
    method: 'put',
    headers: {
      Authorization: request.headers.get('authorization') || '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      status: status,
      score: score,
      num_volumes_read: volume,
      num_chapters_read: chapter,
      start_date: startDate,
      finish_date: endDate,
      comments: comment,
      tags: tags.join(),
    }),
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
