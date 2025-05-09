import { MAL_API_HOST } from '@/src/utils/myanimelist';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resp = await fetch(`${MAL_API_HOST}/v2/anime/${id}/my_list_status`, {
    method: 'delete',
    headers: {
      Authorization: request.headers.get('authorization') || '',
    },
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
