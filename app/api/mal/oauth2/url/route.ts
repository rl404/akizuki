import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import { generateRandomStr } from '@/src/utils/utils';

export type Data = {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  url: string;
};

export async function GET() {
  const clientID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;
  const redirectURI = process.env.NEXT_PUBLIC_MAL_REDIRECT_URI;
  const state = generateRandomStr(20);
  const codeChallenge = generateRandomStr(100);
  return Response.json(
    {
      data: {
        client_id: clientID,
        redirect_uri: redirectURI,
        state: state,
        code_challenge: codeChallenge,
        url: `${MAL_WEB_HOST}/v1/oauth2/authorize?response_type=code&client_id=${clientID}&state=${state}&code_challenge=${codeChallenge}&redirect_uri=${redirectURI}`,
      },
    },
    { status: 200 },
  );
}
