import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useRouter } from 'next/router';
import LoginButton from '../../components/button/LoginButton';
import Head from '../../components/head/Head';
import { getAccessToken } from '../../lib/storage';

export default function Login() {
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;
    const token = getAccessToken();
    if (token) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <Head title="Login" />
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
        <DialogTitle>Welcome to Akizuki</DialogTitle>
        <DialogContent dividers>
          View and edit your anime and manga list in a more modern design with custom tags editor.
        </DialogContent>
        <DialogActions>
          <LoginButton />
        </DialogActions>
      </Dialog>
    </>
  );
}
