'use client';

import { Data } from '@/app/api/mal/oauth2/url/route';
import { setCodeChallenge, setState } from '@/src/utils/myanimelist';
import { getAxiosError } from '@/src/utils/utils';
import Button from '@mui/material/Button';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LoginButton() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios
      .get('/api/mal/oauth2/url')
      .then((resp) => {
        const data: Data = resp.data.data;
        setState(data.state);
        setCodeChallenge(data.code_challenge);
        setUrl(data.url);
      })
      .catch((error) => setError(getAxiosError(error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Button href={url} LinkComponent={Link} loading={loading} disabled={error !== ''}>
      Login with MyAnimeList
    </Button>
  );
}
