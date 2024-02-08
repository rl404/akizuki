import { MAL_WEB_HOST } from '@/src/utils/myanimelist';

export type Data = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const refreshToken = searchParams.get('refresh_token') || '';

  const clientID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID || '';
  const clientSecret = process.env.NEXT_PUBLIC_MAL_CLIENT_SECRET || '';

  const resp = await fetch(`${MAL_WEB_HOST}/v1/oauth2/token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: Buffer.from(clientID + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
