import { Button, Link } from '@mui/material';
import { generateMalOauthURL } from '../../lib/myanimelist';

export default function LoginButton() {
  return (
    <Link href={generateMalOauthURL()}>
      <Button color="warning">Login with MyAnimeList</Button>
    </Link>
  );
}
