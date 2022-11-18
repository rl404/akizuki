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
import * as React from 'react';
import { akizukiAxios } from '../../lib/axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LoadingButton } from '@mui/lab';

export default function ChapterDialog({
  open,
  onClose,
  id,
  title,
  chapter,
  volume,
  userChapter,
  userVolume,
  userStatus,
  userStartDate,
  userEndDate,
  setChapter,
  setVolume,
  setStatus,
  setStartDate,
  setEndDate,
}: {
  open: boolean;
  onClose: () => void;
  id: number;
  title: string;
  chapter: number;
  volume: number;
  userChapter: number;
  userVolume: number;
  userStatus: string;
  userStartDate: string;
  userEndDate: string;
  setChapter: (s: number) => void;
  setVolume: (s: number) => void;
  setStatus: (s: string) => void;
  setStartDate: (s: string) => void;
  setEndDate: (s: string) => void;
}) {
  const [newChapter, setNewChapter] = React.useState<number>(userChapter);
  const [newVolume, setNewVolume] = React.useState<number>(userVolume);

  const onChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChapter(parseInt(e.target.value, 10) || 0);
  };

  const decreaseChapter = () => {
    setNewChapter(newChapter - 1);
  };

  const increaseChapter = () => {
    setNewChapter(newChapter + 1);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVolume(parseInt(e.target.value, 10) || 0);
  };

  const decreaseVolume = () => {
    setNewVolume(newVolume - 1);
  };

  const increaseVolume = () => {
    setNewVolume(newVolume + 1);
  };

  const [completed, setCompleted] = React.useState<boolean>(false);
  const [reading, setReading] = React.useState<boolean>(false);

  const toggleCompleted = () => {
    setReading(false);
    setCompleted(!completed);
  };

  const toggleReading = () => {
    setCompleted(false);
    setReading(!reading);
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
      .patch(`/api/mal/mangalist/chapter`, {
        id: id,
        chapter: newChapter,
        volume: newVolume,
        reading: reading,
        completed: completed,
        todayStart: todayStart,
        todayEnd: todayEnd,
      })
      .then(() => {
        const today = new Date();

        setChapter(newChapter);
        setVolume(newVolume);
        reading && setStatus('reading');
        completed && setStatus('completed');
        todayStart && setStartDate(today.toISOString().slice(0, 10));
        todayEnd && setEndDate(today.toISOString().slice(0, 10));

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
      <DialogTitle>{`${title}'s Chapter`}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <TextField
            label="Chapter"
            value={newChapter}
            size="small"
            onChange={onChapterChange}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${chapter}`}</InputAdornment>,
            }}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton size="small" onClick={decreaseChapter} disabled={newChapter <= 0}>
              <RemoveIcon />
            </IconButton>
          </div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton size="small" onClick={increaseChapter} disabled={chapter !== 0 && newChapter >= chapter}>
              <AddIcon />
            </IconButton>
          </div>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <TextField
            label="Volume"
            value={newVolume}
            size="small"
            onChange={onVolumeChange}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${volume}`}</InputAdornment>,
            }}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton size="small" onClick={decreaseVolume} disabled={newVolume <= 0}>
              <RemoveIcon />
            </IconButton>
          </div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton size="small" onClick={increaseVolume} disabled={volume !== 0 && newVolume >= volume}>
              <AddIcon />
            </IconButton>
          </div>
        </Stack>
        <Stack>
          {userStatus !== 'completed' && chapter > 0 && newChapter === chapter && (
            <>
              <FormControlLabel
                control={<Checkbox size="small" checked={completed} onChange={toggleCompleted} />}
                label="Set status as Completed"
              />
              {userStartDate === '' && (
                <FormControlLabel
                  control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                  label="Set today as start date"
                />
              )}
              {userEndDate === '' && (
                <FormControlLabel
                  control={<Checkbox size="small" checked={todayEnd} onChange={toggleTodayEnd} />}
                  label="Set today as finish date"
                />
              )}
            </>
          )}
          {userStatus !== 'reading' && newChapter > 0 && newChapter !== userChapter && newChapter !== chapter && (
            <>
              <FormControlLabel
                control={<Checkbox size="small" checked={reading} onChange={toggleReading} />}
                label="Set status as Reading"
              />
              {userStartDate === '' && (
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
}
