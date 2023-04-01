import * as React from 'react';
import { Button, Link } from '@mui/material';
import { generateMalOauthURL } from '../../lib/myanimelist';

const LoginButton = React.memo(() => {
  return (
    <Link href={generateMalOauthURL()} underline="none">
      <Button>Login with MyAnimeList</Button>
    </Link>
  );
});

export default LoginButton;
