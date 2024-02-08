import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function PUT(request: Request) {
  const { id, score } = await request.json();

  const resp = await fetch(`${MAL_API_HOST}/v2/anime/${id}/my_list_status`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: request.headers.get('authorization') || '',
    },
    body: new URLSearchParams({
      score: score,
    }),
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
