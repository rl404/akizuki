import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const resp = await fetch(`${MAL_API_HOST}/v2/manga/${params.id}/my_list_status`, {
    method: 'delete',
    headers: {
      Authorization: request.headers.get('authorization') || '',
    },
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
