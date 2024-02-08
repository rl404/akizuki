import { UserAnime } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { getAxiosError } from '@/src/utils/utils';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function EpisodeDialog({
  open,
  onClose,
  data,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  data: UserAnime;
  setData: (data: UserAnime) => void;
}) {
  const [newEpisode, setNewEpisode] = useState<number>(data.userEpisode);
  const [completed, setCompleted] = useState<boolean>(false);
  const [watching, setWatching] = useState<boolean>(false);
  const [todayStart, setTodayStart] = useState<boolean>(false);
  const [todayEnd, setTodayEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setNewEpisode(data.userEpisode);
  }, [data.userEpisode]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewEpisode(parseInt(e.target.value, 10) || 0);

  const increaseEpisode = () => setNewEpisode(newEpisode + 1);
  const decreaseEpisode = () => setNewEpisode(newEpisode - 1);

  const toggleCompleted = () => {
    setWatching(false);
    setCompleted(!completed);
  };

  const toggleWatching = () => {
    setCompleted(false);
    setWatching(!watching);
  };

  const toggleTodayStart = () => setTodayStart(!todayStart);
  const toggleTodayEnd = () => setTodayEnd(!todayEnd);

  const onUpdate = () => {
    setError('');
    setLoading(true);

    akizukiAxios
      .put(`/api/mal/useranime/episode`, {
        id: data.id,
        episode: newEpisode,
        watching: watching,
        completed: completed,
        todayStart: todayStart,
        todayEnd: todayEnd,
      })
      .then(() => {
        const today = new Date();

        setData({
          ...data,
          userEpisode: newEpisode,
          userStatus: completed ? 'completed' : watching ? 'watching' : data.userStatus,
          userStartDate: todayStart ? today.toISOString().slice(0, 10) : data.userStartDate,
          userEndDate: todayEnd ? today.toISOString().slice(0, 10) : data.userEndDate,
        });

        onClose();
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{`${data.title}'s Episode`}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <TextField
            label="Episode"
            value={newEpisode}
            size="small"
            onChange={onChange}
            sx={{ width: 150 }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${data.episode}`}</InputAdornment>,
            }}
          />
          <IconButton size="small" onClick={decreaseEpisode} disabled={newEpisode <= 0}>
            <RemoveIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={increaseEpisode}
            disabled={data.episode !== 0 && newEpisode >= data.episode}
          >
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack>
          {data.userStatus !== 'completed' && data.episode > 0 && newEpisode === data.episode && (
            <>
              <FormControlLabel
                label="Set status as Completed"
                control={<Checkbox size="small" checked={completed} onChange={toggleCompleted} />}
              />
              {data.userStartDate === '' && (
                <FormControlLabel
                  label="Set today as start date"
                  control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                />
              )}
              {data.userEndDate === '' && (
                <FormControlLabel
                  label="Set today as finish date"
                  control={<Checkbox size="small" checked={todayEnd} onChange={toggleTodayEnd} />}
                />
              )}
            </>
          )}
          {data.userStatus !== 'watching' &&
            newEpisode > 0 &&
            newEpisode !== data.userEpisode &&
            newEpisode !== data.episode && (
              <>
                <FormControlLabel
                  label="Set status as Watching"
                  control={<Checkbox size="small" checked={watching} onChange={toggleWatching} />}
                />
                {data.userStartDate === '' && (
                  <FormControlLabel
                    label="Set today as start date"
                    control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                  />
                )}
              </>
            )}
        </Stack>
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
