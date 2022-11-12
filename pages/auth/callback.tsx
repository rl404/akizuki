import * as React from 'react';
import { useRouter } from 'next/router';
import { deleteCodeChallenge, deleteState, getCodeChallenge, validateState } from '../../lib/myanimelist';
import Head from '../../components/head/Head';
import axios from 'axios';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Data } from '../api/mal/oauth2/token';
import { saveToken } from '../../lib/storage';
import Link from 'next/link';

export default function Callback() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!router.isReady) return;

    const { code, state } = router.query;

    if (!code || !state || !validateState(state.toString())) {
      setError('invalid myanimelist authorization');
      setLoading(false);
      return;
    }

    axios
      .post(`/api/mal/oauth2/token?code=${code}&code_verifier=${getCodeChallenge()}`)
      .then((resp) => {
        const data: Data = resp.data;

        saveToken({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        deleteState();
        deleteCodeChallenge();

        router.push('/');
      })
      .catch(() => {
        setError('invalid myanimelist authorization');
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <>
      <Head title="Oauth Callback" />
      <Dialog
        open={true}
        hideBackdrop
        disableEnforceFocus
        fullWidth
        maxWidth="xs"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 'fit-content',
          width: '100%',
        }}
      >
        <DialogTitle>Authentication</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center' }}>
          {loading ? <CircularProgress color="warning" /> : <Typography>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          {error !== '' && (
            <Button href="/auth/login" color="warning" LinkComponent={Link}>
              Back to Login
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
