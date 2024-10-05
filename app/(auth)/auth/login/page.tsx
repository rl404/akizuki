import { AkizukiMetadata } from '@/src/components/metadata';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Metadata } from 'next';

import LoginButton from './LoginButton';
import TokenChecker from './TokenChecker';

export const metadata: Metadata = AkizukiMetadata('Login');

export default function Login() {
  return (
    <>
      <TokenChecker />
      <Dialog open hideBackdrop fullWidth maxWidth="xs">
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
