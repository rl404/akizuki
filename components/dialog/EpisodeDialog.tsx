import * as React from 'react';
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
import LoadingButton from '@mui/lab/LoadingButton';
import { akizukiAxios } from '../../lib/axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { UserAnime } from '../../type/Types';

const EpisodeDialog = ({
  open,
  onClose,
  userAnime,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  userAnime: UserAnime;
  setData: (data: UserAnime) => void;
}) => {
  const [newEpisode, setNewEpisode] = React.useState<number>(userAnime.userEpisode);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEpisode(parseInt(e.target.value, 10) || 0);
  };

  const decreaseEpisode = () => {
    setNewEpisode(newEpisode - 1);
  };

  const increaseEpisode = () => {
    setNewEpisode(newEpisode + 1);
  };

  const [completed, setCompleted] = React.useState<boolean>(false);
  const [watching, setWatching] = React.useState<boolean>(false);

  const toggleCompleted = () => {
    setWatching(false);
    setCompleted(!completed);
  };

  const toggleWatching = () => {
    setCompleted(false);
    setWatching(!watching);
  };

  const [todayStart, setTodayStart] = React.useState<boolean>(false);
  const [todayEnd, setTodayEnd] = React.useState<boolean>(false);

  const toggleTodayStart = () => {
    setTodayStart(!todayStart);
  };

  const toggleTodayEnd = () => {
    setTodayEnd(!todayEnd);
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onUpdate = () => {
    setLoading(true);

    akizukiAxios
      .patch(`/api/mal/animelist/episode`, {
        id: userAnime.id,
        episode: newEpisode,
        watching: watching,
        completed: completed,
        todayStart: todayStart,
        todayEnd: todayEnd,
      })
      .then(() => {
        const today = new Date();

        setData({
          ...userAnime,
          userEpisode: newEpisode,
          userStatus: completed ? 'completed' : watching ? 'watching' : userAnime.userStatus,
          userStartDate: todayStart ? today.toISOString().slice(0, 10) : userAnime.userStartDate,
          userEndDate: todayEnd ? today.toISOString().slice(0, 10) : userAnime.userEndDate,
        });

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${userAnime.title}'s Episode`}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <TextField
            value={newEpisode}
            size="small"
            onChange={onChange}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${userAnime.episode}`}</InputAdornment>,
            }}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton size="small" onClick={decreaseEpisode} disabled={newEpisode <= 0}>
              <RemoveIcon />
            </IconButton>
          </div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton
              size="small"
              onClick={increaseEpisode}
              disabled={userAnime.episode !== 0 && newEpisode >= userAnime.episode}
            >
              <AddIcon />
            </IconButton>
          </div>
        </Stack>
        <Stack>
          {userAnime.userStatus !== 'completed' && userAnime.episode > 0 && newEpisode === userAnime.episode && (
            <>
              <FormControlLabel
                control={<Checkbox size="small" checked={completed} onChange={toggleCompleted} />}
                label="Set status as Completed"
              />
              {userAnime.userStartDate === '' && (
                <FormControlLabel
                  control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                  label="Set today as start date"
                />
              )}
              {userAnime.userEndDate === '' && (
                <FormControlLabel
                  control={<Checkbox size="small" checked={todayEnd} onChange={toggleTodayEnd} />}
                  label="Set today as finish date"
                />
              )}
            </>
          )}
          {userAnime.userStatus !== 'watching' &&
            newEpisode > 0 &&
            newEpisode !== userAnime.userEpisode &&
            newEpisode !== userAnime.episode && (
              <>
                <FormControlLabel
                  control={<Checkbox size="small" checked={watching} onChange={toggleWatching} />}
                  label="Set status as Watching"
                />
                {userAnime.userStartDate === '' && (
                  <FormControlLabel
                    control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                    label="Set today as start date"
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
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate} color="warning">
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EpisodeDialog;
