'use client';

import { generateMalOauthURL } from '@/src/utils/myanimelist';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function LoginButton() {
  return (
    <Button href={generateMalOauthURL()} LinkComponent={Link}>
      Login with MyAnimeList
    </Button>
  );
}
