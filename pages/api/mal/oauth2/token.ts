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
  const { code, code_verifier } = req.query;

  const clientID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID || '';
  const clientSecret = process.env.NEXT_PUBLIC_MAL_CLIENT_SECRET || '';
  const redirectURI = process.env.NEXT_PUBLIC_MAL_REDIRECT_URI || '';

  const resp = await fetch(`${WEB_MAL_HOST}/v1/oauth2/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: req.method,
    body: new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code?.toString() || '',
      code_verifier: code_verifier?.toString() || '',
      redirect_uri: redirectURI,
    }),
  });

  const data = await resp.json();
  res.status(resp.status).json(data);
}
