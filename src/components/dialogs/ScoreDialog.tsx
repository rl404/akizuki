import theme from '@/src/components/theme';
import { MediaType, UserAnime, UserManga } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { getAxiosError } from '@/src/utils/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

export default function ScoreDialog({
  open,
  onClose,
  data,
  type,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  data: UserAnime | UserManga;
  type: MediaType;
  setData: (data: UserAnime | UserManga) => void;
}) {
  const [newScore, setNewScore] = useState<number>(data.userScore);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setNewScore(data.userScore);
  }, [data.userScore]);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewScore(parseInt(e.target.value, 10) || 0);
  const onClick = (score: number) => setNewScore(score);

  const onUpdate = () => {
    setError('');
    setLoading(true);

    akizukiAxios
      .put(`/api/mal/user${type}/score`, {
        id: data.id,
        score: newScore,
      })
      .then(() => {
        setData({ ...data, userScore: newScore });
        onClose();
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{`${data.title}'s Score`}</DialogTitle>
      <DialogContent dividers>
        {!isSm ? (
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <Button
                key={s}
                variant={newScore === s ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onClick(s)}
                sx={{ minWidth: '30px' }}
              >
                {s}
              </Button>
            ))}
          </Stack>
        ) : (
          <TextField select label="Score" fullWidth value={newScore} onChange={onChange} size="small">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((s) => (
              <MenuItem value={s} key={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        {error && (
          <Typography color="error" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate}>
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
