// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { WEB_MAL_HOST } from '../../../../lib/myanimelist';

export type Data = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { refresh_token } = req.query;

  const clientID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID || '';
  const clientSecret = process.env.NEXT_PUBLIC_MAL_CLIENT_SECRET || '';

  const resp = await fetch(`${WEB_MAL_HOST}/v1/oauth2/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: Buffer.from(clientID + ':' + clientSecret).toString('base64'),
    },
    method: req.method,
    body: new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refresh_token?.toString() || '',
    }),
  });

  const data = await resp.json();
  res.status(resp.status).json(data);
}
