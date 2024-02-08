'use client';

import { Data } from '@/app/api/mal/oauth2/token/route';
import { deleteCodeChallenge, deleteState, getCodeChallenge, validateState } from '@/src/utils/myanimelist';
import { saveToken } from '@/src/utils/user';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function CallbackWithSuspense() {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
}

function Callback() {
  const router = useRouter();
  const searchParam = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const code = searchParam.get('code') || '';
    const state = searchParam.get('state') || '';

    if (code === '' || state === '' || !validateState(state)) {
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
      .catch(() => setError('invalid myanimelist authorization'))
      .finally(() => setLoading(false));
  }, [router, searchParam]);

  return (
    <Dialog open hideBackdrop fullWidth maxWidth="xs">
      <DialogTitle>Authentication</DialogTitle>
      <DialogContent dividers sx={{ textAlign: 'center' }}>
        {loading ? <CircularProgress /> : <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        {error !== '' && (
          <Button href="/auth/login" LinkComponent={Link}>
            Back to Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
