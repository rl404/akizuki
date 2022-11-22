import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { akizukiAxios } from '../../lib/axios';
import { theme } from '../theme';

const ScoreDialog = ({
  open,
  onClose,
  type,
  id,
  title,
  score,
  setScore,
}: {
  open: boolean;
  onClose: () => void;
  type: string;
  id: number;
  title: string;
  score: number;
  setScore: (s: number) => void;
}) => {
  const [newScore, setNewScore] = React.useState<number>(score);

  const onClickScore = (s: number) => {
    setError('');
    setNewScore(s);
  };

  const onChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setNewScore(parseInt(e.target.value, 10) || 0);
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onUpdate = () => {
    setLoading(true);

    akizukiAxios
      .patch(`/api/mal/${type}list/score`, {
        id: id,
        score: newScore,
      })
      .then(() => {
        setScore(newScore);
        onClose();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.error) {
            setError(error.response.error);
            return;
          }
          if (error.response.message) {
            setError(error.response.message);
            return;
          }
        }
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${title}'s Score`}</DialogTitle>
      <DialogContent dividers>
        {!isSm ? (
          <Stack direction="row" spacing={1} justifyContent="center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
              return (
                <Button
                  key={s}
                  variant={newScore === s ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => onClickScore(s)}
                  sx={{ minWidth: '30px' }}
                  color="warning"
                >
                  {s}
                </Button>
              );
            })}
          </Stack>
        ) : (
          <TextField select label="Score" fullWidth value={newScore} onChange={onChangeScore} size="small">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
              return (
                <MenuItem value={s} key={s}>
                  {s}
                </MenuItem>
              );
            })}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        {error && (
          <Typography color="error" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate} color="warning">
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ScoreDialog;
